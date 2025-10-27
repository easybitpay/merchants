# Gateway Creation Flow Documentation

## Overview
This document describes the complete payment gateway creation flow implemented at `http://localhost:5173/#/add-application`. The flow follows a modern 6-step wizard pattern inspired by Stripe and neobank onboarding experiences.

## Architecture

### Main Components
- **Parent Orchestrator**: `/src/views/app/AddApplication.vue`
- **Step Components**: Located in `/src/components/add-application/`
- **Store**: `/src/stores/app.js` (Pinia)
- **API Service**: `/src/core/services/api.js`

### State Management
```javascript
// Parent component state
const activeStep = ref(0)              // Current step index (0-5)
const loading = ref(false)             // Loading state for API calls
const appInfo = ref({})                // Accumulated form data across steps
const createdAppInfo = ref({})         // API response after gateway creation
```

---

## Step-by-Step Flow

### Step 0: Gateway Setup (Start.vue)
**Purpose**: Collect basic information and gateway type selection

#### Component: `Start.vue`
**Event Listener**: `submitStep0`

#### User Input Fields:
1. **Gateway Type** (Required) - Radio selection
   - `Type 1`: Standard Gateway - For online shops & e-commerce
   - `Type 2`: Donate - For donations & fundraising  
   - `Type 3`: Fix Prices - For fixed price products

2. **Business Name** (Required)
   - Field: `form.name`
   - Placeholder: "e.g., My Online Store"
   - Validation: Required field

3. **Website URL** (Required)
   - Field: `form.site_url`
   - Placeholder: "https://example.com"
   - Validation: Required field, URL format

4. **Terms & Conditions** (Required)
   - Field: `term`
   - Validation: Must be checked

#### Data Emitted to Parent:
```javascript
{
  agree: Boolean,
  type: Object,        // Selected gateway type object
  name: String,        // Business name
  site_url: String     // Website URL
}
```

#### Validation Rules:
- All fields are required
- Terms must be accepted before proceeding
- Client-side validation with error messages

---

### Step 1: Integration Setup (Pro.vue)
**Purpose**: Configure webhook endpoints and customer information preferences

#### Component: `Pro.vue`
**Event Listener**: `submitStep1`

#### User Input Fields:
1. **Callback URL** (Required)
   - Field: `generalForm.callback_url`
   - Placeholder: "https://mystore.com/webhooks/callback"
   - Purpose: Receive real-time payment status updates
   - Validation: Required

2. **Success Redirect URL** (Required)
   - Field: `generalForm.redirect_url`
   - Placeholder: "https://mystore.com/payment/success"
   - Purpose: Where customers return after successful payment
   - Validation: Required

3. **Fixed Amount** (Conditional - Only for Type 2: Donate)
   - Field: `amountForm.amount`
   - Placeholder: "10.00"
   - Validation: Required if gateway type is Donate

4. **Customer Information Checkboxes** (Optional)
   - Field: `generalForm.need_name` - Collect customer name
   - Field: `generalForm.need_email` - Collect email address

#### Data Emitted to Parent:
```javascript
{
  callback_url: String,     // Webhook endpoint
  redirect_url: String,     // Success page URL
  need_name: Boolean,       // Collect name preference
  need_email: Boolean,      // Collect email preference
  amount: String           // Only if Type 2 (Donate)
}
```

#### Validation Rules:
- `callback_url`: Required
- `redirect_url`: Required
- `amount`: Required only if `appInfo.type.type === 2`
- Uses Vuelidate for form validation

---

### Step 2: Currency Configuration (CryptoSetup.vue)
**Purpose**: Select cryptocurrencies and CREATE the gateway

#### Component: `CryptoSetup.vue`
**Event Listener**: `submitStep2`

#### User Input Fields:
1. **Base Currency** (Required)
   - Field: `base_token`
   - Component: `CryptoSelect` (single selection)
   - Purpose: Primary currency for pricing products
   - Validation: Required

2. **Accepted Currencies** (Required)
   - Field: `available_tokens`
   - Component: `CryptoSelect` (multiple selection)
   - Purpose: Currencies customers can pay with
   - Validation: At least one currency required

#### 🚨 CRITICAL API CALL - Gateway Creation
This step makes the **PRIMARY API CALL** to create the gateway with ALL accumulated data:

**API Endpoint**: `POST /apps`

**Request Type**: `multipart/form-data` (FormData)

**Request Payload**:
```javascript
const fd = new FormData()
fd.append('settings', JSON.stringify({
  need_name: Boolean,          // From Step 1
  need_email: Boolean,         // From Step 1
  color: String,              // From Step 3 (if available)
  amount: String              // From Step 1 (if Type 2)
}))
fd.append('type', Number)                    // From Step 0
fd.append('name', String)                    // From Step 0
fd.append('site_url', String)                // From Step 0
fd.append('customer_fee_percent', Number)    // From Step 3 (default: 0)
fd.append('callback_url', String)            // From Step 1
fd.append('redirect_url', String)            // From Step 1
fd.append('base_token_id', Number)           // From Step 2
fd.append('available_tokens', String)        // From Step 2 (comma-separated IDs)
fd.append('logo', File)                     // From Step 3 (if uploaded)
fd.append('banner', File)                   // From Step 3 (if uploaded)
```

**API Response**:
```javascript
{
  id: Number,              // Gateway ID
  api_key: String,         // API Key for authentication
  private_key: String,     // Secret Key for webhooks
  pay_url: String,         // Payment URL (for Type 2 & 3)
  name: String,            // Gateway name
  status: Number,          // Status (0: inactive, 1: active)
  // ... other gateway details
}
```

**Store Method**: `store.createApp(fd)`

**Response Handling**:
- Success: `emit('setCreatedAppInfo', res)` - Stores API credentials
- Failure: Shows error alert and stops loading

#### Data Emitted to Parent:
```javascript
{
  baseCoin: Object,         // Selected base token object
  availableCoins: Array     // Array of selected token objects
}
```

#### Validation Rules:
- `baseCoin`: Required - Must select one base currency
- `availableCoins`: Required - Must select at least one accepted currency
- `available_tokens` string cannot be empty (prevents backend validation error)

---

### Step 3: Customization (Info.vue)
**Purpose**: Optional branding and fee distribution customization

#### Component: `Info.vue`
**Event Listener**: `submitStep3`
**Note**: This step is **OPTIONAL** - users can skip entirely

#### User Input Fields:
1. **Primary Color** (Optional) - Currently disabled
   - Field: `form.color`
   - Component: `SelectColorDropdown` (disabled with `v-if="false"`)
   - Purpose: Brand color for buttons and accents
   - Status: ⚠️ Temporarily disabled due to component render issues

2. **Logo Upload** (Optional)
   - Field: `logo`
   - Format: PNG or SVG, max 2MB
   - Preview: Shows uploaded logo on banner preview

3. **Banner Upload** (Optional)
   - Field: `banner`
   - Format: JPG or PNG, 1200x400px recommended
   - Preview: Shows uploaded banner with logo overlay

4. **Fee Distribution** (Optional)
   - Field: `form.customer_fee_percent`
   - Type: Range slider (0-100%)
   - Step: 5%
   - Default: 0% (merchant pays all fees)
   - Example: 50% = split fees equally between merchant and customer

#### Conditional API Call
**Only makes API call if customization was provided**:

**API Endpoint**: `POST /apps/{id}` (Update)

**Condition**:
```javascript
const hasCustomization = 
  form.value.color || 
  logo.value || 
  banner.value || 
  form.value.customer_fee_percent > 0

if (hasCustomization && createdAppInfo?.id) {
  // Make API call
}
```

**Request Payload**:
```javascript
const fd = new FormData()
fd.append('settings', JSON.stringify({
  color: String,              // Brand color (if selected)
  need_name: Boolean,         // Preserved from Step 1
  need_email: Boolean,        // Preserved from Step 1
  amount: String             // Preserved from Step 1 (if Type 2)
}))
fd.append('customer_fee_percent', Number)  // Fee distribution (if > 0)
fd.append('logo', File)                   // Logo file (if uploaded)
fd.append('banner', File)                 // Banner file (if uploaded)
```

**Store Method**: `store.updateApp({ id, fd })`

#### Data Emitted to Parent:
```javascript
{
  color: String,                  // Brand color (if selected)
  logo: File,                     // Logo file (if uploaded)
  banner: File,                   // Banner file (if uploaded)
  customer_fee_percent: Number    // Fee distribution percentage
}
```

#### Validation Rules:
- All fields are optional
- No Vuelidate rules applied
- Always proceeds to next step (even if no customization)

---

### Step 4: Review Configuration (Verify.vue)
**Purpose**: Display gateway summary and API credentials

#### Component: `Verify.vue`
**Event Listener**: `submitStep4`
**No API Call** - Read-only review step

#### Display Sections:
1. **Gateway Preview Card**
   - Shows uploaded banner (or default)
   - Shows uploaded logo (or default)
   - Displays gateway type and name

2. **General Settings**
   - Website URL

3. **Integration Settings**
   - Callback URL
   - Redirect URL

4. **API Credentials** (if gateway created)
   - **For Type 1 (Standard Gateway)**:
     - API Key with copy button
     - Secret Key with copy button
   - **For Type 2 & 3 (Donate/Fixed Price)**:
     - Payment Link with copy button

5. **Cryptocurrency Settings**
   - Base currency (with logo)
   - Accepted currencies (with logos)

#### Copy to Clipboard Features:
```javascript
// Copy API Key or Payment Link
copyToClipboard(createdAppInfo.api_key, 'api')

// Copy Secret Key (Type 1 only)
copyToClipboard(createdAppInfo.private_key, 'secret')
```

#### Data Emitted to Parent:
```javascript
{}  // Empty object - just proceeds to next step
```

---

### Step 5: Domain Verification (DomainVerify.vue)
**Purpose**: Verify domain ownership via file upload

#### Component: `DomainVerify.vue`
**Event Listener**: `submitStep5`

#### Verification Process (4 Steps):

**Step 1: Download Verification File**
- Button: "Download easybitpay-domain-verification.txt"
- Content: Contains API Key from `createdAppInfo.api_key`
- File Type: Plain text (.txt)

**Download Function**:
```javascript
const downloadVerificationFile = () => {
  const content = createdAppInfo.api_key
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'easybitpay-domain-verification.txt'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

**Step 2: Upload to .well-known Directory**
- User must upload file to: `{site_url}/.well-known/easybitpay-domain-verification.txt`
- Example: `https://mystore.com/.well-known/easybitpay-domain-verification.txt`
- Copy button provided for easy path copying

**Step 3: Test Verification URL**
- External link button opens: `{site_url}/.well-known/easybitpay-domain-verification.txt`
- Should display the API key in browser
- Confirms file is publicly accessible

**Step 4: Verify & Launch**
- Click "Verify & Launch" button

#### API Call - Domain Verification
**API Endpoint**: `GET /apps/{id}/domain`

**Request**: No body parameters (uses app ID from URL)

**Store Method**: `store.verifyAppDomain(id)`

**Response Handling**:
- Success: Proceeds to completion
- Failure: Shows error alert

**Expected Backend Behavior**:
The backend should:
1. Fetch file from: `{site_url}/.well-known/easybitpay-domain-verification.txt`
2. Read file content
3. Compare content with stored API key
4. Return success if match
5. Activate gateway if verification succeeds

#### Data Emitted to Parent:
```javascript
{}  // Empty object - final step completion
```

#### Troubleshooting Information:
- Displays help text about web server configuration
- Mentions .well-known directory requirements
- Provides WordPress-specific guidance (public_html/.well-known)

---

## API Integration Summary

### API Endpoints Used

#### 1. Get Cryptocurrencies List
**Endpoint**: `GET /tokens`  
**When**: Step 2 - `onMounted`  
**Store Method**: `store.getTokens()`  
**Response**: Array of token objects with id, name, symbol, logo

#### 2. Create Gateway (PRIMARY API CALL)
**Endpoint**: `POST /apps`  
**When**: Step 2 - User clicks "Create Gateway"  
**Store Method**: `store.createApp(fd)`  
**Request**: FormData with all gateway configuration  
**Response**: Gateway object with id, api_key, private_key, pay_url

#### 3. Update Gateway (Customization)
**Endpoint**: `POST /apps/{id}`  
**When**: Step 3 - If customization provided  
**Store Method**: `store.updateApp({ id, fd })`  
**Request**: FormData with branding assets and fee settings  
**Response**: Updated gateway object

#### 4. Verify Domain
**Endpoint**: `GET /apps/{id}/domain`  
**When**: Step 5 - User clicks "Verify & Launch"  
**Store Method**: `store.verifyAppDomain(id)`  
**Request**: No body (app ID in URL)  
**Response**: Success/failure status

---

## Navigation System

### Event-Driven Architecture
The wizard uses CustomEvent for step submission:

```javascript
// Parent dispatches event based on current step
document.dispatchEvent(new CustomEvent(`submitStep${activeStep.value}`))

// Each child component listens for its specific event
onMounted(() => {
  document.addEventListener('submitStep0', () => submitForm())
})
```

### Navigation Flow:
1. User clicks "Continue" button (or "Create Gateway", etc.)
2. Parent calls `submitForm()`
3. Dispatches `submitStep{N}` event
4. Child component's listener catches event
5. Child validates form
6. Child emits `@goNext` with data
7. Parent merges data into `appInfo`
8. Parent increments `activeStep`
9. Next component loads

### Button Text Logic:
```javascript
const nextButtonText = computed(() => {
  if (activeStep.value === 2) return 'Create Gateway'
  if (activeStep.value === 3) return 'Save & Continue'
  if (activeStep.value === 4) return 'Continue to Verification'
  if (activeStep.value === 5) return 'Verify & Launch'
  return 'Continue'
})
```

### Back Button Logic:
- Hidden on Step 0 (first step)
- Hidden on Step 3 (optional customization - user can skip instead)
- Decrements `activeStep` and scrolls to top

### Skip Button:
- Only visible on Step 3 (Customization)
- Proceeds to next step without API call

---

## Data Flow Diagram

```
Step 0 (Start.vue)
  ↓ Emits: { type, name, site_url, agree }
  → Stored in appInfo

Step 1 (Pro.vue)
  ↓ Emits: { callback_url, redirect_url, need_name, need_email, amount? }
  → Merged into appInfo

Step 2 (CryptoSetup.vue)
  ↓ Emits: { baseCoin, availableCoins }
  → Merged into appInfo
  ↓ API CALL: POST /apps (with ALL appInfo data)
  → Response stored in createdAppInfo
  ✓ Gateway Created with API Key

Step 3 (Info.vue)
  ↓ Emits: { color?, logo?, banner?, customer_fee_percent }
  → Merged into appInfo
  ↓ Conditional API CALL: POST /apps/{id} (if customization provided)
  ✓ Gateway Updated with Branding

Step 4 (Verify.vue)
  ↓ Emits: {}
  → Display only (no API call)
  ✓ Shows createdAppInfo credentials

Step 5 (DomainVerify.vue)
  ↓ Emits: {}
  ↓ API CALL: GET /apps/{id}/domain
  ✓ Domain Verified
  → Gateway Activated & Ready to Use
```

---

## Validation Strategy

### Client-Side Validation

**Step 0**: Custom reactive validation
```javascript
const errors = computed(() => ({
  type: showErrors.value && !selectedType.value.type,
  name: showErrors.value && !form.value.name,
  site_url: showErrors.value && !form.value.site_url,
  term: showErrors.value && !term.value
}))
```

**Step 1 & 2**: Vuelidate
```javascript
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

const rules = {
  callback_url: { required: helpers.withMessage('Callback url is required', required) },
  redirect_url: { required: helpers.withMessage('Redirect url is required', required) }
}

const v$ = useVuelidate(rules, form)
const result = await v$.value.$validate()
```

**Step 3**: No validation (optional step)

**Step 4**: No validation (display only)

**Step 5**: No validation (API handles verification)

### Server-Side Validation
Expected backend validation for `/apps` endpoint:
- Validate `available_tokens` is not empty
- Validate URLs are proper format
- Validate file uploads (size, type)
- Validate token IDs exist
- Verify domain ownership on verification endpoint

---

## Error Handling

### API Error Scenarios

**Step 2 - Gateway Creation Failure**:
```javascript
const res = await store.createApp(fd)
if (!res) {
  alert('Failed to create application. Please check your connection and try again.')
  emit('changeLoadingStatus', false)
  return
}
```

**Step 3 - Update Failure**:
```javascript
const success = await store.updateApp({ id, fd })
if (!success) {
  alert('Failed to update application customization. Please check your connection and try again.')
  emit('changeLoadingStatus', false)
  return
}
```

**Step 5 - Domain Verification Failure**:
```javascript
const success = await store.verifyAppDomain(id)
if (success) {
  emit('goNext', {})
} else {
  alert('Domain verification failed. Please ensure the verification file is accessible at your domain root and try again.')
}
```

### Known Issues & Workarounds

**Issue 1**: `available_tokens` null error
- **Cause**: Empty or whitespace-only `available_tokens` string
- **Fix**: Added validation check before API call in Step 2
```javascript
if (!availableCoinsString || availableCoinsString.trim() === '') {
  alert('Please select at least one accepted currency')
  emit('changeLoadingStatus', false)
  return
}
```

**Issue 2**: SelectColorDropdown breaks rendering
- **Cause**: Component error in SelectColorDropdown.vue
- **Temporary Fix**: Disabled with `v-if="false"` in Info.vue
- **Status**: ⚠️ Needs component investigation

---

## UI/UX Features

### Progress Tracking
- **Progress Bar**: Visual indicator at top (0-100%)
- **Horizontal Stepper**: Shows all 6 steps with check marks on completion
- **Step States**: Not Started → Active → Completed

### Loading States
```javascript
const loading = ref(false)

// Show spinner and disable button during API calls
emit('changeLoadingStatus', true)
await store.createApp(fd)
emit('changeLoadingStatus', false)
```

### Transitions
```vue
<transition name="slide-fade" mode="out-in">
  <div :key="activeStep">
    <!-- Step component -->
  </div>
</transition>
```

### Dark Mode Support
All components include `[data-bs-theme="dark"]` scoped styles with:
- Dark backgrounds (`#1a1d1e`, `#0f1011`)
- Light text colors (`#f3f4f6`, `#e5e7eb`)
- Override inline styles with `!important`

### Responsive Design
Container width breakpoints:
- Desktop (>1440px): 1400px
- Laptop (1200-1440px): 1200px
- Tablet (768-1200px): 960px
- Mobile (<768px): 100% width

---

## Security Considerations

### API Credentials
- **API Key**: Public identifier (safe to expose in frontend)
- **Private Key**: Secret key (should be stored securely by merchant)
- **Pay URL**: Public payment link (Type 2 & 3)

### Clipboard Copy
Uses secure `navigator.clipboard.writeText()` API:
```javascript
await navigator.clipboard.writeText(text)
```

### Domain Verification
- Prevents unauthorized gateway usage
- Requires file upload to prove domain ownership
- File must be publicly accessible at standardized path
- Follows `.well-known` convention (RFC 8615)

---

## Testing Checklist

### Step 0: Gateway Setup
- [ ] All 3 gateway types selectable
- [ ] Business name required validation
- [ ] Website URL required validation
- [ ] Terms checkbox required validation
- [ ] Terms modal opens and accepts

### Step 1: Integration
- [ ] Callback URL required validation
- [ ] Redirect URL required validation
- [ ] Fixed amount shows only for Type 2 (Donate)
- [ ] Customer info checkboxes toggle correctly

### Step 2: Currency Configuration
- [ ] Tokens load on mount
- [ ] Base currency single selection works
- [ ] Accepted currencies multiple selection works
- [ ] At least one currency required validation
- [ ] Gateway creation API call succeeds
- [ ] API key returned in response
- [ ] Loading spinner shows during API call

### Step 3: Customization
- [ ] Can skip entire step
- [ ] Logo upload and preview works
- [ ] Banner upload and preview works
- [ ] Fee distribution slider works (0-100%)
- [ ] No API call if no customization
- [ ] API call only if customization provided

### Step 4: Review
- [ ] Displays all configuration correctly
- [ ] Shows uploaded logo/banner or defaults
- [ ] Shows API key for Type 1
- [ ] Shows Payment Link for Type 2 & 3
- [ ] Copy buttons work for credentials
- [ ] Shows base and accepted currencies with logos

### Step 5: Domain Verification
- [ ] File download works with correct name
- [ ] File contains API key
- [ ] Path displays user's actual domain
- [ ] Copy button works for file path
- [ ] Test URL button opens correct link
- [ ] Domain verification API call succeeds
- [ ] Error handling for verification failure

### Navigation
- [ ] Progress bar updates correctly
- [ ] Step indicators show active/completed states
- [ ] Back button hidden on Step 0 and 3
- [ ] Skip button only on Step 3
- [ ] Button text changes per step
- [ ] Smooth scroll to top on navigation

### Dark Mode
- [ ] All steps render correctly in dark mode
- [ ] No white containers visible
- [ ] Text readable with proper contrast
- [ ] Forms and inputs styled for dark theme

---

## Development Notes

### File Structure
```
src/
├── views/app/
│   └── AddApplication.vue          # Parent orchestrator
├── components/add-application/
│   ├── Start.vue                   # Step 0
│   ├── Pro.vue                     # Step 1
│   ├── CryptoSetup.vue            # Step 2
│   ├── Info.vue                    # Step 3
│   ├── Verify.vue                  # Step 4
│   ├── DomainVerify.vue           # Step 5
│   └── CryptoSelect.vue            # Reusable crypto selector
├── stores/
│   └── app.js                      # Pinia store with API methods
└── assets/sass/
    └── components/
        └── _premium-wizard.scss    # Wizard-specific styles
```

### Adding New Fields
To add a new field to any step:

1. Add field to component's `form` ref
2. Add validation rule (if required)
3. Include field in emitted data object
4. Update API payload in Step 2 (createApp) or Step 3 (updateApp)
5. Update this documentation

### Debugging Tips
```javascript
// Log accumulated data before API call
console.log('Creating gateway with data:', {
  appInfo: appInfo.value,
  createdAppInfo: createdAppInfo.value
})

// Check if API key is available
console.log('API Key:', createdAppInfo.value?.api_key)

// Verify FormData contents
for (let [key, value] of fd.entries()) {
  console.log(key, value)
}
```

---

## Backend Requirements

### Expected Endpoints

#### POST /apps
**Purpose**: Create new gateway  
**Content-Type**: multipart/form-data  
**Required Fields**:
- `type` (number): Gateway type (1, 2, or 3)
- `name` (string): Business name
- `site_url` (string): Website URL
- `callback_url` (string): Webhook endpoint
- `redirect_url` (string): Success page URL
- `base_token_id` (number): Base currency ID
- `available_tokens` (string): Comma-separated token IDs
- `settings` (JSON string): Configuration object

**Optional Fields**:
- `customer_fee_percent` (number): Fee distribution (0-100)
- `logo` (file): Logo image
- `banner` (file): Banner image

**Response**:
```json
{
  "id": 123,
  "api_key": "pub_xxxxxxxxxxxxx",
  "private_key": "sec_xxxxxxxxxxxxx",
  "pay_url": "https://pay.easybitpay.com/xxxxx",
  "name": "My Store",
  "status": 0,
  "type": 1,
  ...
}
```

#### POST /apps/{id}
**Purpose**: Update gateway customization  
**Content-Type**: multipart/form-data  
**Fields**: Same as create, but all optional

#### GET /apps/{id}/domain
**Purpose**: Verify domain ownership  
**Expected Behavior**:
1. Fetch `{site_url}/.well-known/easybitpay-domain-verification.txt`
2. Compare file content with stored API key
3. Activate gateway if match
4. Return success/failure

**Response**:
```json
{
  "success": true,
  "message": "Domain verified successfully"
}
```

#### GET /tokens
**Purpose**: Get available cryptocurrencies  
**Response**: Array of token objects
```json
[
  {
    "id": 1,
    "name": "Tether",
    "symbol": "USDT",
    "logo": "/storage/tokens/usdt.png"
  },
  ...
]
```

---

## Future Enhancements

### Potential Improvements
1. **Fix SelectColorDropdown**: Investigate and resolve component rendering issue
2. **Add Email Verification**: Verify callback_url and redirect_url are reachable
3. **Add Gateway Testing**: Test mode before activation
4. **Improve File Upload**: Drag-and-drop support, image cropping
5. **Add More Gateway Types**: Subscription, Invoicing, etc.
6. **Enhanced Validation**: Real-time URL checking, domain format validation
7. **Progress Persistence**: Save progress in localStorage for resume later
8. **API Documentation Link**: Link to API docs from credentials step

### Accessibility Improvements
- Add ARIA labels to all form fields
- Keyboard navigation for step progression
- Screen reader announcements for step changes
- Focus management on step transitions

---

## Contact & Support

For questions about this implementation:
- Frontend Components: Check component comments and props definitions
- API Integration: Review `/src/stores/app.js` methods
- Styling: See `/src/assets/sass/components/_premium-wizard.scss`

**Route**: `/#/add-application`  
**Parent Component**: `/src/views/app/AddApplication.vue`  
**Git Branch**: `feature/dark-mode-implementation`

---

*Last Updated: October 26, 2025*  
*Documentation Version: 1.0*
