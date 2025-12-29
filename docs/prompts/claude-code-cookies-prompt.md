# Claude Code Prompt: GDPR-Compliant Cookies Popup

## Task
Create a GDPR-compliant cookies popup/banner component with professional design and full functionality.

## Requirements

### Compliance & Legal (CRITICAL)
- Include clear disclosure about cookie usage
- Require explicit user consent (no pre-ticked boxes)
- Provide easy rejection option without penalty
- Include links to Privacy Policy and cookie settings
- Store user choice persistently in localStorage
- Comply with GDPR, CCPA, and European privacy laws

### Design
- Clean, modern aesthetic with subtle gradient background
- Fixed positioning at the bottom of the page
- Professional typography and spacing
- Smooth slide-up animation on page load
- Fade-out animation when dismissed
- Two-color button scheme: primary blue for "Accept", ghost/outline for "Reject"
- Fully responsive design (desktop and mobile)
- Non-intrusive but clearly visible

### Functionality
- Display banner on initial page load
- Check localStorage for previous user choice
- Hide banner if user has already made a selection
- "Accept All" button: saves consent, animates out, logs acceptance
- "Reject" button: saves rejection choice, animates out, logs rejection
- Reset functionality (optional): allow clearing localStorage for testing
- Support for linking to privacy policy and cookie settings pages

### Technical Implementation
- Single HTML file with embedded CSS and JavaScript
- No external dependencies or libraries required
- Vanilla JavaScript for maximum compatibility
- CSS Grid/Flexbox for layout
- CSS animations for smooth transitions
- LocalStorage API for persistent consent management
- Mobile-first responsive design
- Cross-browser compatible

### Content & Copy
- Friendly but professional tone
- Clear explanation of cookie usage in 1-2 sentences
- Include placeholder links to "#privacy" and "#settings" (customizable)
- Include cookie emoji in heading for visual interest
- Accessibility: semantic HTML, proper contrast ratios

### Optional Enhancements
- Implement a "Settings" button that opens a modal for granular cookie preferences (Analytics, Marketing, Functional)
- Add fade-in animation for demo content below the banner
- Include visual feedback when buttons are clicked
- Add a link to reset consent for testing purposes
- Dark mode support with CSS variables

## Output Format
Provide a complete, production-ready HTML file that:
1. Works immediately without any setup
2. Includes demo content below the banner
3. Has all CSS embedded in `<style>` tags
4. Has all JavaScript embedded in `<script>` tags
5. Includes comments explaining key sections
6. Is fully functional out of the box

## Design Direction
- **Aesthetic**: Modern minimalist with subtle sophistication
- **Color Palette**: White/light gray background, blue primary action buttons, dark gray text
- **Typography**: System fonts for reliability, clear hierarchy
- **Spacing**: Generous padding and margins for breathing room
- **Effects**: Subtle shadows, smooth animations, micro-interactions on hover

## Testing
The output should include:
- Demo text content below the banner
- Visible console logs when buttons are clicked
- Easy way to test (clear localStorage by opening DevTools or clicking reset)
- Instructions for customization

## Customization Points
Make it easy to customize:
- Colors (button colors, text colors, background)
- Text (banner heading, description, button labels)
- Links (privacy policy URL, settings page URL)
- Timing (animation duration, banner position)

Start with the HTML file and ensure it's production-ready.