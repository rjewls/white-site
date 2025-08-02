import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Type, Plus, X, ChevronUp, ChevronDown, Bold, Italic, Underline, Palette } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { compressImages } from "@/lib/imageCompression";
import { useToast } from "@/hooks/use-toast";

interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  alignment?: 'left' | 'center' | 'right';
}

interface RichContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  order: number;
  formatting?: TextFormatting;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  t: (key: string) => string;
}

// Helper function to convert fontSize to CSS font size
const getFontSizeClass = (fontSize: string): string => {
  const sizeMap: Record<string, string> = {
    'sm': '14px',
    'base': '16px',
    'lg': '18px',
    'xl': '20px',
    '2xl': '24px',
    '3xl': '30px'
  };
  return sizeMap[fontSize] || '16px';
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter description...",
  t 
}) => {
  const { toast } = useToast();
  
  const [blocks, setBlocks] = useState<RichContentBlock[]>(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          // Ensure all blocks have formatting properties for backward compatibility
          return parsed.map(block => ({
            ...block,
            formatting: block.formatting || {
              bold: false,
              italic: false,
              underline: false,
              color: '#000000',
              fontSize: 'base',
              alignment: 'left'
            }
          }));
        } else {
          return [{ 
            id: '1', 
            type: 'text', 
            content: value, 
            order: 0,
            formatting: {
              bold: false,
              italic: false,
              underline: false,
              color: '#000000',
              fontSize: 'base',
              alignment: 'left'
            }
          }];
        }
      }
    } catch {
      return value ? [{ 
        id: '1', 
        type: 'text', 
        content: value, 
        order: 0,
        formatting: {
          bold: false,
          italic: false,
          underline: false,
          color: '#000000',
          fontSize: 'base',
          alignment: 'left'
        }
      }] : [];
    }
    return [];
  });
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent when blocks change
  const updateParent = (newBlocks: RichContentBlock[]) => {
    const sortedBlocks = newBlocks.sort((a, b) => a.order - b.order);
    onChange(JSON.stringify(sortedBlocks));
  };

  // Add a new text block
  const addTextBlock = () => {
    const newBlock: RichContentBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      order: blocks.length,
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        color: '#000000',
        fontSize: 'base',
        alignment: 'left'
      }
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  // Add an image block
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploadingImage(true);
    
    try {
      // Compress the image
      const compressedFiles = await compressImages(Array.from(files));
      if (compressedFiles.length === 0) return;
      
      const file = compressedFiles[0];
      
      // Clean filename to remove special characters and spaces
      const cleanFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
        .replace(/\s+/g, '_') // Replace spaces with underscore
        .toLowerCase(); // Convert to lowercase
      
      const fileName = `${Date.now()}-${cleanFileName}`;
      
      // Upload to Supabase (same way as Admin page)
      console.log('Attempting to upload file:', fileName, 'Size:', file.size, 'Type:', file.type);
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const publicUrl = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName).data.publicUrl;
        
      console.log('Generated public URL:', publicUrl);

      // Add image block
      const newBlock: RichContentBlock = {
        id: Date.now().toString(),
        type: 'image',
        content: publicUrl,
        order: blocks.length
      };
      
      const newBlocks = [...blocks, newBlock];
      setBlocks(newBlocks);
      updateParent(newBlocks);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Show user-friendly error message
      const errorMessage = error?.message || 'Failed to upload image. Please try again.';
      toast({
        title: "Image Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Update block content
  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  // Update block formatting
  const updateBlockFormatting = (id: string, formatting: Partial<TextFormatting>) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { 
        ...block, 
        formatting: { ...block.formatting, ...formatting }
      } : block
    );
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    updateParent(newBlocks);
  };

  // Move block up
  const moveBlockUp = (id: string) => {
    const blockIndex = blocks.findIndex(block => block.id === id);
    if (blockIndex > 0) {
      const newBlocks = [...blocks];
      [newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [newBlocks[blockIndex - 1], newBlocks[blockIndex]];
      // Update order values
      newBlocks.forEach((block, index) => {
        block.order = index;
      });
      setBlocks(newBlocks);
      updateParent(newBlocks);
    }
  };

  // Move block down
  const moveBlockDown = (id: string) => {
    const blockIndex = blocks.findIndex(block => block.id === id);
    if (blockIndex < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
      // Update order values
      newBlocks.forEach((block, index) => {
        block.order = index;
      });
      setBlocks(newBlocks);
      updateParent(newBlocks);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTextBlock}
          className="flex items-center gap-2"
        >
          <Type className="w-4 h-4" />
          Add Text
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          {isUploadingImage ? 'Uploading...' : 'Add Image'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files)}
        className="hidden"
      />

      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="mb-4">No content blocks added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={addTextBlock}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add First Text Block
          </Button>
        </div>
      )}

      {/* Render blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {block.type === 'text' ? (
                  <Type className="w-4 h-4 text-gray-600" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {block.type === 'text' ? 'Text Block' : 'Image Block'}
                </span>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlockUp(block.id)}
                  disabled={index === 0}
                  className="p-1 h-auto"
                  title="Move up"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlockDown(block.id)}
                  disabled={index === blocks.length - 1}
                  className="p-1 h-auto"
                  title="Move down"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBlock(block.id)}
                  className="p-1 h-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {block.type === 'text' ? (
              <div className="space-y-3">
                {/* Text Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant={block.formatting?.bold ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateBlockFormatting(block.id, { bold: !block.formatting?.bold })}
                      className="p-1 h-7 w-7"
                      title="Bold"
                    >
                      <Bold className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      variant={block.formatting?.italic ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateBlockFormatting(block.id, { italic: !block.formatting?.italic })}
                      className="p-1 h-7 w-7"
                      title="Italic"
                    >
                      <Italic className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      variant={block.formatting?.underline ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateBlockFormatting(block.id, { underline: !block.formatting?.underline })}
                      className="p-1 h-7 w-7"
                      title="Underline"
                    >
                      <Underline className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="h-4 w-px bg-gray-300" />
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Size:</Label>
                    <Select
                      value={block.formatting?.fontSize || 'base'}
                      onValueChange={(value) => updateBlockFormatting(block.id, { fontSize: value as TextFormatting['fontSize'] })}
                    >
                      <SelectTrigger className="h-7 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="base">Normal</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">X-Large</SelectItem>
                        <SelectItem value="2xl">2X-Large</SelectItem>
                        <SelectItem value="3xl">3X-Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Color:</Label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={block.formatting?.color || '#000000'}
                        onChange={(e) => updateBlockFormatting(block.id, { color: e.target.value })}
                        className="w-7 h-7 border rounded cursor-pointer"
                        title="Text Color"
                      />
                      <Palette className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="h-4 w-px bg-gray-300" />
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Align:</Label>
                    <Select
                      value={block.formatting?.alignment || 'left'}
                      onValueChange={(value) => updateBlockFormatting(block.id, { alignment: value as TextFormatting['alignment'] })}
                    >
                      <SelectTrigger className="h-7 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Text Content */}
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Enter text content..."
                  className="min-h-[80px] bg-white"
                  style={{
                    fontWeight: block.formatting?.bold ? 'bold' : 'normal',
                    fontStyle: block.formatting?.italic ? 'italic' : 'normal',
                    textDecoration: block.formatting?.underline ? 'underline' : 'none',
                    color: block.formatting?.color || '#000000',
                    fontSize: getFontSizeClass(block.formatting?.fontSize || 'base'),
                    textAlign: block.formatting?.alignment || 'left'
                  }}
                />

              </div>
            ) : (
              <div className="space-y-2">
                <img
                  src={block.content}
                  alt="Content"
                  className="max-w-full h-auto rounded-lg border bg-white"
                  style={{ maxHeight: '200px' }}
                />
                <p className="text-xs text-gray-500 break-all">
                  {block.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to render rich content on the frontend
interface RichContentRendererProps {
  content: string;
  className?: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  let blocks: RichContentBlock[] = [];
  
  try {
    const parsed = JSON.parse(content);
    blocks = Array.isArray(parsed) ? parsed : [];
  } catch {
    // Fallback for plain text content
    return (
      <div className={className}>
        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className={className}>
        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }

  const sortedBlocks = blocks.sort((a, b) => a.order - b.order);

  return (
    <div className={className}>
      {sortedBlocks.map((block) => (
        <div key={block.id} className="mb-4 last:mb-0">
          {block.type === 'text' ? (
            <div
              style={{
                fontWeight: block.formatting?.bold ? 'bold' : 'normal',
                fontStyle: block.formatting?.italic ? 'italic' : 'normal',
                textDecoration: block.formatting?.underline ? 'underline' : 'none',
                color: block.formatting?.color || '#374151',
                fontSize: getFontSizeClass(block.formatting?.fontSize || 'base'),
                textAlign: block.formatting?.alignment || 'left',
                lineHeight: '1.6'
              }}
              className="whitespace-pre-wrap"
            >
              {block.content}
            </div>
          ) : (
            <div className="my-6">
              <img
                src={block.content}
                alt="Description content"
                className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};