# 💡 Quick Tips & Troubleshooting

## Quick Tips

### 🎯 Productivity Tips

1. **Quick Navigation**
   - Use breadcrumb for instant folder jumping
   - Double-click folders to enter
   - Right-click for quick actions

2. **Efficient Selection**
   - Use Shift+Click for range selection (coming soon)
   - Ctrl+A to select all (coming soon)
   - Checkbox for precise multi-select

3. **Search Like a Pro**
   - Search works in current folder only
   - Case-insensitive by default
   - Clear button for quick reset

4. **Organization Best Practices**
   - Create folders by project/category
   - Use consistent naming conventions
   - Regular cleanup of unused files
   - Use date sorting to find recent files

### 🎨 UI Customization

1. **Theme Preference**
   - Dark mode saves battery on OLED screens
   - Light mode better for bright environments
   - Theme preference persists across sessions

2. **View Modes**
   - Grid: Better for visual recognition
   - List: More information density
   - Switch based on your task

### 💾 Data Management

1. **Backup Your Data**
   ```javascript
   // Browser console
   const data = localStorage.getItem('fileManagerData');
   console.log(data); // Copy this
   ```

2. **Restore Data**
   ```javascript
   // Browser console
   const backup = 'YOUR_BACKUP_JSON_HERE';
   localStorage.setItem('fileManagerData', backup);
   location.reload();
   ```

3. **Export All Data**
   - All files as JSON through download
   - Manual localStorage backup
   - Browser export/import feature

## 🐛 Troubleshooting

### Common Issues

#### 1. Files Not Showing
**Problem**: Files disappeared after refresh

**Solutions**:
- Check localStorage isn't full (max ~5-10MB)
- Check browser privacy settings (localStorage enabled)
- Try different browser
- Check browser console for errors

**How to fix**:
```javascript
// Check localStorage
console.log(localStorage.getItem('fileManagerData'));

// Clear and reset
localStorage.removeItem('fileManagerData');
location.reload();
```

#### 2. Theme Not Switching
**Problem**: Theme toggle not working

**Solutions**:
- Check browser console for JavaScript errors
- Try refreshing the page (Ctrl+R)
- Clear browser cache
- Check if CSS loaded properly

#### 3. Upload Not Working
**Problem**: Upload button not responding

**Note**: This is a demo app with simulated uploads
- Upload creates file metadata only
- No actual file content stored
- Files appear with default info

**Expected behavior**:
- File appears in list
- Shows name, type, size
- Date set to today

#### 4. Search Not Finding Files
**Problem**: Search returns no results

**Checks**:
- Are you in the correct folder?
- Search is case-insensitive
- Check spelling
- Search only searches current folder

#### 5. Context Menu Not Appearing
**Problem**: Right-click doesn't show menu

**Solutions**:
- Ensure right-clicking directly on item
- Check if browser is blocking context menu
- Try left-click on checkbox then use action bar
- Mobile: Try long-press

#### 6. Modal Won't Close
**Problem**: Modal stuck open

**Solutions**:
- Click outside modal area
- Press Escape key
- Click X button
- Refresh page if stuck

#### 7. Slow Performance
**Problem**: App running slowly

**Causes & Solutions**:
- Too many files (>1000)
  - Solution: Organize into more folders
- Deep nesting (>5 levels)
  - Solution: Flatten structure
- Browser issues
  - Solution: Close other tabs, refresh
- localStorage full
  - Solution: Clear old data

#### 8. LocalStorage Full
**Problem**: "QuotaExceededError"

**Solutions**:
```javascript
// Check size
console.log(
  new Blob([localStorage.getItem('fileManagerData')]).size / 1024 / 1024 + ' MB'
);

// Clear specific key
localStorage.removeItem('fileManagerData');

// Clear all localStorage (WARNING: loses all data)
localStorage.clear();
```

#### 9. Styles Not Loading
**Problem**: App looks broken

**Solutions**:
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check network tab in DevTools
- Ensure CSS files loaded
- Try incognito mode

#### 10. Cannot Delete Items
**Problem**: Delete button not working

**Checks**:
- Items selected (checkboxes checked)?
- Check browser console for errors
- Try context menu delete
- Refresh and try again

### Browser Compatibility

#### Supported Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

#### Known Browser Issues
- **Safari**: Some CSS animations may differ
- **Firefox**: Context menu position slight offset
- **Mobile**: Long-press for context menu
- **IE11**: Not supported (use modern browser)

### Mobile-Specific Issues

#### 1. Context Menu on Mobile
**Solution**: Long-press on item instead of right-click

#### 2. Small Touch Targets
**Solution**: Use list view for better touch targets

#### 3. Keyboard Covers Input
**Solution**: Modal auto-scrolls to keep input visible

#### 4. Slow on Old Devices
**Solution**: 
- Use list view (less rendering)
- Limit items per folder
- Close background apps

### Development Issues

#### 1. npm install fails
**Solutions**:
```bash
# Clear cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Try yarn instead
yarn install
```

#### 2. Port Already in Use
**Solutions**:
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- --port 3001
```

#### 3. Build Fails
**Solutions**:
```bash
# Clear dist folder
rm -rf dist

# Rebuild
npm run build

# Check for syntax errors
npm run build -- --debug
```

#### 4. Hot Reload Not Working
**Solutions**:
- Save file again
- Restart dev server
- Check file permissions
- Disable antivirus temporarily

## 🔧 Advanced Troubleshooting

### Browser Console Commands

```javascript
// Check app state
console.log(localStorage.getItem('fileManagerData'));

// Count total files
const data = JSON.parse(localStorage.getItem('fileManagerData'));
const countFiles = (items) => {
  return items.reduce((count, item) => {
    return count + 1 + (item.items ? countFiles(item.items) : 0);
  }, 0);
};
console.log('Total items:', countFiles(data));

// Find specific file
const findFile = (items, name) => {
  for (let item of items) {
    if (item.name.includes(name)) console.log('Found:', item);
    if (item.items) findFile(item.items, name);
  }
};
findFile(data, 'your-filename');

// Export data
const backup = localStorage.getItem('fileManagerData');
const blob = new Blob([backup], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'tgridu-backup.json';
a.click();
```

### Performance Monitoring

```javascript
// Check localStorage usage
const usage = new Blob([
  JSON.stringify(localStorage)
]).size / 1024 / 1024;
console.log(`LocalStorage: ${usage.toFixed(2)} MB`);

// Monitor re-renders (in component)
useEffect(() => {
  console.log('Component rendered');
});
```

## 📞 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Check browser console for errors
3. Try different browser
4. Clear cache and try again
5. Check FEATURES.md for expected behavior

### Reporting Issues

Include:
- Browser & version
- Operating system
- Steps to reproduce
- Console errors (if any)
- Screenshots (if applicable)
- Expected vs actual behavior

### Useful Information

```
Browser: Chrome 120.0.0
OS: Windows 11
Screen: 1920x1080
Touch: No
Error: [paste error from console]
```

## 🎓 Learning Resources

### Understanding the Code
- React Hooks documentation
- LocalStorage API
- CSS Grid & Flexbox
- SVG icons
- Event handling

### Customization Guide
- See FEATURES.md for architecture
- Check inline comments in code
- Modify CSS variables for colors
- Extend file types in App.jsx

## ✅ Quick Fixes Checklist

- [ ] Refreshed page (Ctrl+R)
- [ ] Checked browser console
- [ ] Tried different browser
- [ ] Cleared browser cache
- [ ] LocalStorage not full
- [ ] JavaScript enabled
- [ ] Modern browser version
- [ ] No browser extensions interfering
- [ ] No network issues
- [ ] Cookies/localStorage enabled

---

**Still having issues? Check the browser console for specific error messages!**
