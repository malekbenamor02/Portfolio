# How to Add Favicon and Social Media (OG) Image

## 📌 Step 1: Prepare Your Images

### Favicon Requirements:
- **Format:** `.ico` file (or `.png` for modern browsers)
- **Size:** 32x32px or 16x16px (or multiple sizes)
- **Location:** `public/favicon2.ico` (or `public/favicon.ico`)

### OG Image (Social Media) Requirements:
- **Format:** `.png` or `.jpg`
- **Size:** 1200x630px (recommended for best quality)
- **Aspect Ratio:** 1.91:1
- **Location:** `public/images/og-image.png`

## 📌 Step 2: Add Your Favicon

### Option A: Using .ico file
1. Create or convert your image to `.ico` format
2. Name it `favicon2.ico`
3. Place it in the `public/` folder
4. Replace the existing `public/favicon2.ico` file

### Option B: Using .png file (modern approach)
1. Create a PNG image (32x32px or 64x64px)
2. Name it `favicon.png`
3. Place it in the `public/` folder
4. Update the code (see below)

**Tools to create favicon:**
- Online: https://favicon.io/ or https://realfavicongenerator.net/
- Design tools: Figma, Photoshop, Canva

## 📌 Step 3: Add Your OG Image

1. Create your OG image (1200x630px)
   - Include your name: "Malek Ben Amor"
   - Add your tagline: "Junior Full Stack Developer"
   - Use your brand colors (teal/lavender theme)
   - Make it visually appealing

2. Save it as `og-image.png`

3. Create the directory if it doesn't exist:
   ```
   public/images/
   ```

4. Place the image at:
   ```
   public/images/og-image.png
   ```

**Tools to create OG image:**
- Online: https://www.canva.com/ (search "Open Graph Image")
- Design tools: Figma, Photoshop
- Templates: Search "OG image template 1200x630"

## 📌 Step 4: Update Code (if needed)

The code is already configured! Just make sure:

✅ **Favicon:** Already set to `/favicon2.ico` in:
   - `src/app/layout.tsx` (lines 34-36)
   - `src/app/metadata.ts` (lines 32-34)

✅ **OG Image:** Already set to `/images/og-image.png` in:
   - `src/lib/constants.ts` (line 7)
   - `src/app/metadata.ts` (line 45)

## 📌 Step 5: Test Your Images

### Test Favicon:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Visit your site
3. Check the browser tab - you should see your favicon

### Test OG Image:
1. Use these tools to preview:
   - **Facebook Debugger:** https://developers.facebook.com/tools/debug/
   - **Twitter Card Validator:** https://cards-dev.twitter.com/validator
   - **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

2. Enter your website URL and click "Fetch new information"

## 📌 Quick Checklist

- [ ] Favicon created and placed in `public/favicon2.ico`
- [ ] OG image created (1200x630px) and placed in `public/images/og-image.png`
- [ ] Test favicon in browser
- [ ] Test OG image with social media validators
- [ ] Commit and push changes to GitHub

## 💡 Tips

1. **Favicon:** Keep it simple - it's tiny! Use your initials or a simple logo
2. **OG Image:** Make it eye-catching - this is what people see when sharing your portfolio
3. **Colors:** Match your portfolio theme (teal/lavender gradient)
4. **Text:** Keep text minimal and readable at small sizes

## 🎨 Example OG Image Content Ideas

- Your name prominently displayed
- Your role/title
- A subtle background (maybe stars to match your theme)
- Your website URL (optional)
- Professional photo (optional)

---

**Note:** After adding images, you may need to:
1. Restart your dev server
2. Clear browser cache
3. Hard refresh (Ctrl+F5 or Cmd+Shift+R)

