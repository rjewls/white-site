# Supabase Storage Upload Fix

## Issue
Rich Text Editor image uploads were failing with a 400 error when uploading to the `product-images` bucket.

## Root Cause
The issue was likely caused by:
1. **Special characters in filenames** - The original filename "Livré par erreur.jpg" contained special characters (é) that caused URL encoding issues
2. **Upload configuration differences** - Using different upload options than the main Admin page

## Solution Applied

### 1. Filename Sanitization
```javascript
// Clean filename to remove special characters and spaces
const cleanFileName = file.name
  .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
  .replace(/\s+/g, '_') // Replace spaces with underscore
  .toLowerCase(); // Convert to lowercase
```

### 2. Consistent Upload Method
Changed from:
```javascript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });
```

To match the Admin page approach:
```javascript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(fileName, file);
```

### 3. Enhanced Error Handling
- Added proper error logging
- Added toast notifications for user feedback
- Added debugging information for troubleshooting

### 4. No Bucket Changes Needed
The existing `product-images` bucket is used correctly. No new bucket creation required.

## Testing
1. Try uploading images with special characters in filename
2. Verify images appear in the rich text editor
3. Confirm images display correctly on product detail pages

## File Changes
- Updated `src/components/RichTextEditor.tsx`
  - Fixed filename sanitization
  - Improved error handling
  - Added proper toast notifications
  - Added debugging logs
