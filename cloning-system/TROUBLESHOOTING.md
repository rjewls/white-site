# 🚨 Troubleshooting Guide

Common issues and solutions when setting up boutique site clones.

---

## 🔧 Environment Variables Issues

### Problem: Site shows default values instead of custom configuration
**Symptoms:**
- Site still shows "My Boutique Store" or placeholder text
- Environment variables not loading

**Solutions:**
1. **Check file location**: Ensure `.env.local` is in the project root (not in subdirectories)
2. **Restart development server**: Stop (`Ctrl+C`) and restart (`npm run dev`)
3. **Check variable names**: All variables must start with `VITE_`
4. **Verify file format**: No spaces around equals signs
   ```bash
   # ✅ Correct
   VITE_SITE_NAME="My Store"
   
   # ❌ Incorrect
   VITE_SITE_NAME = "My Store"
   ```

### Problem: Environment variables work in development but not production
**Solutions:**
1. **Netlify**: Add environment variables in Site Settings → Environment Variables
2. **Vercel**: Add in Project Settings → Environment Variables
3. **Build-time variables**: Remember that `VITE_` variables are build-time, not runtime

---

## 🗄️ Supabase Connection Issues

### Problem: "Failed to fetch" or connection errors
**Solutions:**
1. **Check URLs**: Verify `VITE_SUPABASE_URL` is correct
   ```
   Format: https://your-project-ref.supabase.co
   ```
2. **Check keys**: Verify `VITE_SUPABASE_ANON_KEY` is the anon key, not the service key
3. **Test connection**: Use browser console:
   ```javascript
   // Test in browser console
   fetch('https://your-project.supabase.co/rest/v1/', {
     headers: { 'apikey': 'your-anon-key' }
   })
   ```

### Problem: RLS (Row Level Security) errors
**Symptoms:**
- "insufficient privileges" errors
- Data not showing up for authenticated users

**Solutions:**
1. **Check RLS policies**: Ensure policies are created for your tables
2. **Verify authentication**: Make sure user is properly authenticated
3. **Re-run SQL script**: Execute the complete database schema again

### Problem: Image upload failures
**Solutions:**
1. **Check storage bucket**: Ensure `product-images` bucket exists
2. **Verify policies**: Run storage policies from the SQL script
3. **Check file size**: Files must be under 50MB
4. **File types**: Only images are allowed

---

## 🚚 Noest Express API Issues

### Problem: CORS errors in development
**Symptoms:**
- "CORS policy" errors in browser console
- API calls fail in development but work in production

**Solutions:**
1. **Use Netlify dev**: `npm run dev:netlify` (if configured)
2. **Use production deployment**: Deploy to Netlify for testing
3. **Configure proxy**: Ensure `_redirects` file is in `public/` directory

### Problem: Authentication failed errors
**Solutions:**
1. **Check credentials**: Verify API token and GUID in admin panel
2. **Test credentials**: Use the "Test Order" button in admin
3. **Contact Noest**: Ensure your account is active and credentials are valid

### Problem: Invalid order data
**Symptoms:**
- "Validation error" messages
- Orders rejected by Noest API

**Solutions:**
1. **Check required fields**: Ensure all required order fields are filled
2. **Phone format**: Must be 9-10 digits, numbers only
3. **Weight validation**: Must be positive integer (kg)
4. **Commune validation**: Must be valid commune name for the wilaya

---

## 🎨 Styling Issues

### Problem: Tailwind styles not applying
**Solutions:**
1. **Check config**: Verify `tailwind.config.ts` includes your files in content array
2. **Restart server**: Tailwind changes require server restart
3. **Check imports**: Ensure Tailwind directives are in your CSS file:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Problem: Custom colors not working
**Solutions:**
1. **Check theme extension**: Ensure colors are added to `theme.extend.colors`
2. **Use correct format**: Colors should be hex values
3. **Restart server**: Color changes require restart

---

## 📱 Mobile Issues

### Problem: Site not responsive on mobile
**Solutions:**
1. **Check viewport**: Ensure viewport meta tag is in `index.html`
2. **Use responsive classes**: Use `sm:`, `md:`, `lg:` prefixes
3. **Test breakpoints**: Use browser dev tools to test different sizes

---

## 🚀 Deployment Issues

### Problem: Build fails
**Common errors and solutions:**

1. **TypeScript errors**:
   ```bash
   # Skip type checking for quick fix
   npm run build -- --no-type-check
   ```

2. **Missing environment variables**:
   - Add all `VITE_` variables to your deployment platform

3. **Import path errors**:
   - Check all import paths are correct
   - Use absolute imports with path mapping if configured

### Problem: Site works locally but not in production
**Solutions:**
1. **Environment variables**: Ensure all variables are set in production
2. **Base URL**: Check if you need to set a base URL for subdirectory deployment
3. **API endpoints**: Verify all API calls use correct URLs

### Problem: Netlify deployment issues
**Solutions:**
1. **Build settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Redirects**: Ensure `_redirects` file is in `public/` directory
3. **Function timeout**: For large builds, increase function timeout in Netlify settings

---

## 🔐 Authentication Issues

### Problem: Users can't log in
**Solutions:**
1. **Check Supabase auth**: Ensure authentication is enabled in Supabase
2. **Email confirmation**: Check if email confirmation is required
3. **Test admin login**: Try creating a user directly in Supabase

### Problem: Admin panel not accessible
**Solutions:**
1. **Check protection**: Ensure `ProtectedRoute` is working
2. **User roles**: Verify user has proper permissions
3. **Authentication state**: Check if user session persists

---

## 📊 Performance Issues

### Problem: Slow loading times
**Solutions:**
1. **Optimize images**: Ensure images are compressed (WebP format)
2. **Lazy loading**: Implement lazy loading for images
3. **Database queries**: Optimize Supabase queries with indexes

### Problem: Large bundle size
**Solutions:**
1. **Tree shaking**: Ensure unused code is removed
2. **Code splitting**: Use dynamic imports for large components
3. **Analyze bundle**: Use `npm run build -- --analyze`

---

## 🔍 Debugging Tips

### Enable Debug Mode
Add to your `.env.local`:
```env
VITE_DEBUG_MODE="true"
```

### Browser Console Debugging
```javascript
// Check environment variables (in browser console)
console.log(import.meta.env);

// Test Supabase connection
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Check local storage
console.log('Auth data:', localStorage.getItem('sb-your-project-auth-token'));
```

### Network Tab Debugging
1. Open browser dev tools → Network tab
2. Look for failed requests (red entries)
3. Check request headers and response details

---

## 📞 Getting Help

### Before asking for help:
1. ✅ Check this troubleshooting guide
2. ✅ Run the verification script: `node cloning-system/scripts/verify-setup.js`
3. ✅ Check browser console for errors
4. ✅ Try the setup on a fresh directory

### Information to provide:
- Operating system (Windows/Mac/Linux)
- Node.js version (`node --version`)
- Error messages (full text)
- Steps to reproduce the issue
- Screenshots if relevant

### Useful Resources:
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

## ✅ Quick Fixes Checklist

When something isn't working, try these in order:

1. **Restart development server** (`Ctrl+C` then `npm run dev`)
2. **Clear browser cache** (Hard refresh: `Ctrl+F5`)
3. **Check browser console** for error messages
4. **Verify environment variables** are set correctly
5. **Check file locations** (`.env.local` in root, `_redirects` in public/)
6. **Test with fresh git clone** to rule out local issues
7. **Run verification script** to check setup

---

**Remember: Most issues are configuration-related and can be solved by carefully checking environment variables and file locations!** 🎯
