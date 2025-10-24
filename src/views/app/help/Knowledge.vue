<script setup>
import { ScrollSpy } from 'bootstrap'
import { onMounted, ref } from 'vue'
import Prism from 'prismjs'

// State
const copyButtonText = ref('Copy for LLM')
const copyButtonIcon = ref('copy')

// Code Examples
const createInvoiceJSON = `{
  "base_token": "USDT",
  "amount": 100,
  "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
  "description": "Payment for invoice #124",
  "client_order_identifier": "3"
}`

const createInvoiceResponse = `{
  "status": "ok",
  "message": "Your invoice has been saved successfully",
  "invoice": {
    "app_id": 192,
    "status": 0,
    "amount": "100",
    "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
    "description": "Payment for invoice #124",
    "client_order_identifier": "3",
    "id": 4399,
    "base_token_id": 32,
    "code": "mVmMjM3ZWQwMzVlM"
  },
  "tokens": [...],
  "payment_url": "https://pay.easybitpay.com/#/pay/invoice/mVmMjM3ZWQwMzVlM"
}`

const callbackPayload = `{
  "MODE": "live",
  "EVENT_APP": "26b612fb-eeee-4a33-bcfb-0167319da858",
  "EVENT_HASH": "4d86d95cca5dafd973e874edccd8a2f0",
  "EVENT_TYPE": "PAYMENT_SUCCESS",
  "EVENT_DATA": {
    "invoice": {
      "id": 4619,
      "app_id": 195,
      "base_token_id": 37,
      "amount": "20",
      "paid": "20",
      "status": 10,
      "code": "WQ1ZjJjNjRiNGIwO",
      "client_order_identifier": "2568",
      "created_at": "2025-10-21 14:28:02"
    }
  },
  "EVENT_TIME": 1761057143
}`

const verifyHashPseudo = `payload = parsed JSON
invoice = payload.EVENT_DATA.invoice

string_to_hash =
    invoice.id + ":" +
    invoice.base_token_id + ":" +
    invoice.amount + ":" +
    invoice.client_order_identifier + ":" +
    invoice.code + ":" +
    YOUR_PRIVATE_KEY + ":" +
    payload.EVENT_TIME

expected_hash = MD5(string_to_hash)
if expected_hash != payload.EVENT_HASH:
    reject as unauthentic`

const phpExample = `// Create invoice
$response = Http::withHeaders([
    'X-API-Key' => config('services.easybitpay.key'),
])->post(config('services.easybitpay.url').'/invoices', [
    'base_token' => 'USDT',
    'amount' => 100,
    'available_tokens' => 'TRX,USDT-POLYGON,ECG-Binance',
    'description' => 'Payment for invoice #124',
    'client_order_identifier' => (string) $payment->id,
]);

$data = $response->json();
if (! $data || ! isset($data['invoice'])) {
    throw new \\RuntimeException('EasyBitPay: invalid response');
}

$invoice = $data['invoice'];
$payment->code = $invoice['code'];
$payment->invoice_id = $invoice['id'];
$payment->save();

// Redirect to hosted checkout
return redirect($data['payment_url']);`

const curlExample = `curl -X POST https://api.easybitpay.com/invoices \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "base_token": "USDT",
    "amount": 100,
    "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
    "description": "Payment for invoice #124",
    "client_order_identifier": "3"
  }'`

const scrollToId = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const copyForLLM = async () => {
  const llmContent = `# EasyBitPay API — Developer Documentation

> **Scope:** Merchant-facing API to create invoices and track crypto payments with EasyBitPay.
> **What's new in v3:** Key management notes (public/private keys), webhook/callback payload & verification (EVENT_HASH), status mapping (e.g., status=10), and environment clarifications.

---

## 1) Concepts & Environments

### Environments
- **Mainnet (production):** https://api.easybitpay.com (callback MODE: "live")
- **Sandbox (testing):** https://api-sandbox.easybitpay.com (no real token movement)

### Accounts & Flow
1. **Register** in the EasyBitPay panel.
2. **Create a gateway** (configure name, image, banner).
3. **Generate an API key** for that gateway (merchants can manage **multiple gateways**).
4. **Validate your site/domain** — once validated, the API key activates.
5. **Create invoices** from the panel _or_ via API (this document).
6. **Redirect customers** to the hosted checkout payment_url.
7. **Receive callbacks** on your **callback URL** with payment events (e.g., PAYMENT_SUCCESS).
8. **Verify** callback authenticity using EVENT_HASH, then update your order state.

### Tokens
- You may pass **token IDs** or **token names/symbols** (e.g., USDT, TRX, USDT-POLYGON, ECG-Binance).
- Use available_tokens to restrict which tokens the end‑user can choose at checkout.

---

## 2) Authentication

Every request must include your gateway key:
\`\`\`
X-API-Key: <YOUR_API_KEY>
\`\`\`

> Use different keys for sandbox vs production. Never expose keys in frontend code or public repos.

---

## 3) Base URLs

\`\`\`
Mainnet:  https://api.easybitpay.com
Sandbox:  https://api-sandbox.easybitpay.com
\`\`\`

All endpoints described below are relative to these base URLs.

---

## 4) Key Management (Public / Private Keys)

When you generate a **public key** in the panel, the system **also generates a matching private key**. This private key is used to **confirm data authenticity** (e.g., to build/verify EVENT_HASH in callbacks).

- The **private key is shown only once** at creation time. Store it securely (HSM, vault, KMS).
- If you lose it, **revoke** the key pair and generate a new one; the previous private key cannot be retrieved again.
- Rotate keys periodically and after any suspected compromise.
- Keep separate key pairs per environment (sandbox vs mainnet).

> You will also configure a **Callback URL** in the gateway settings. EasyBitPay will send payment notifications there.

---

## 5) Invoices API

### 5.1 Create Invoice
**POST** /invoices

Create a new invoice. Pass the **base token** (by **name** or **ID**), charge **amount**, a description, and your internal order ID (client_order_identifier).

**Headers**
\`\`\`
X-API-Key: <YOUR_API_KEY>
Content-Type: application/json
\`\`\`

**Body (JSON example):**
\`\`\`json
{
  "base_token": "USDT",
  "amount": 100,
  "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
  "description": "Payment for invoice #124",
  "client_order_identifier": "3"
}
\`\`\`

**cURL Example:**
\`\`\`bash
curl -X POST https://api.easybitpay.com/invoices \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "base_token": "USDT",
    "amount": 100,
    "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
    "description": "Payment for invoice #124",
    "client_order_identifier": "3"
  }'
\`\`\`

**Successful Response (example):**
\`\`\`json
{
  "status": "ok",
  "message": "Your invoice has been saved successfully",
  "invoice": {
    "app_id": 192,
    "status": 0,
    "amount": "100",
    "available_tokens": "TRX,USDT-POLYGON,ECG-Binance",
    "description": "Payment for invoice #124",
    "client_order_identifier": "3",
    "id": 4399,
    "base_token_id": 32,
    "code": "mVmMjM3ZWQwMzVlM"
  },
  "tokens": [...],
  "payment_url": "https://pay.easybitpay.com/#/pay/invoice/mVmMjM3ZWQwMzVlM"
}
\`\`\`

**Next step:** Redirect your customer to payment_url.

**PHP/Laravel Example:**
\`\`\`php
// Create invoice
$response = Http::withHeaders([
    'X-API-Key' => config('services.easybitpay.key'),
])->post(config('services.easybitpay.url').'/invoices', [
    'base_token' => 'USDT',
    'amount' => 100,
    'available_tokens' => 'TRX,USDT-POLYGON,ECG-Binance',
    'description' => 'Payment for invoice #124',
    'client_order_identifier' => (string) $payment->id,
]);

$data = $response->json();
if (! $data || ! isset($data['invoice'])) {
    throw new \\RuntimeException('EasyBitPay: invalid response');
}

$invoice = $data['invoice'];
$payment->code = $invoice['code'];
$payment->invoice_id = $invoice['id'];
$payment->save();

// Redirect to hosted checkout
return redirect($data['payment_url']);
\`\`\`

### 5.2 Get Invoice (Details)
**GET** /invoices/{code}

Retrieve invoice by its short unique code.

### 5.3 Get Payment Status
**GET** /invoices/status/{code}

Fetch the latest payment status for the invoice code.

**Typical statuses (examples):**
- pending — created, awaiting payment
- paid — payment detected, awaiting confirmations
- confirmed — confirmed on-chain
- failed / expired — not payable anymore

> **Note:** In some responses you may see numeric status codes. For example, status: 10 means **paid**.

---

## 6) Callbacks / Webhooks

### 6.1 Configure Callback URL
In the gateway settings, define your **Callback URL** (HTTPS). EasyBitPay will send notifications (e.g., PAYMENT_SUCCESS) to this endpoint whenever an invoice's state changes.

### 6.2 Sample Callback Payload
Below is an example payload you may receive from EasyBitPay:

\`\`\`json
{
  "MODE": "live",
  "EVENT_APP": "26b612fb-eeee-4a33-bcfb-0167319da858",
  "EVENT_HASH": "4d86d95cca5dafd973e874edccd8a2f0",
  "EVENT_TYPE": "PAYMENT_SUCCESS",
  "EVENT_DATA": {
    "invoice": {
      "id": 4619,
      "app_id": 195,
      "base_token_id": 37,
      "amount": "20",
      "paid": "20",
      "status": 10,
      "code": "WQ1ZjJjNjRiNGIwO",
      "client_order_identifier": "2568",
      "created_at": "2025-10-21 14:28:02"
    }
  },
  "EVENT_TIME": 1761057143
}
\`\`\`

**Notes**
- MODE: "live" ⇒ **mainnet**.
- status: 10 in EVENT_DATA.invoice ⇒ **paid**.
- EVENT_TYPE e.g., PAYMENT_SUCCESS — route business logic accordingly.

### 6.3 Verifying Callback Authenticity (EVENT_HASH)

Each callback includes EVENT_HASH. Use it to ensure the payload truly comes from EasyBitPay.

**High‑level algorithm (pseudocode):**
\`\`\`
payload = parsed JSON
invoice = payload.EVENT_DATA.invoice

string_to_hash =
    invoice.id + ":" +
    invoice.base_token_id + ":" +
    invoice.amount + ":" +
    invoice.client_order_identifier + ":" +
    invoice.code + ":" +
    YOUR_PRIVATE_KEY + ":" +
    payload.EVENT_TIME

expected_hash = MD5(string_to_hash)
if expected_hash != payload.EVENT_HASH:
    reject as unauthentic
\`\`\`

**Best practices**
- Store your **private key** in a secure secrets manager (not in code).
- Enforce **replay protection** using EVENT_TIME (reject old timestamps and duplicates).
- **Constant‑time** compare for hashes.
- After accepting a valid callback, **fetch current invoice** (optional) and confirm state before finalizing.

---

## 7) Sandbox Utilities

**POST** /invoices/update-status/{code} (Sandbox only) — simulate pay, cancel, expire to test webhooks and state transitions.

---

## 8) Withdraw (Separate API)

GET https://withdraw.api.easybitpay.com/withdraw — separate from invoices; may require different auth.

---

## 9) Data Model & Params (Quick Reference)

| Field                      | Type        | Required | Notes |
|---------------------------|-------------|---------:|------|
| base_token                | string/int  | ✓ | Base token by name/symbol (e.g., USDT) or ID. |
| amount                    | number/str  | ✓ | Amount to charge in base token. |
| available_tokens          | string      |  — | CSV list of tokens/networks (e.g., TRX,USDT-POLYGON,ECG-Binance). |
| description               | string      |  — | Human‑readable invoice description. |
| client_order_identifier   | string      |  — | Your order ID (idempotency). |
| code (response)           | string      |  — | Short unique invoice code. |
| payment_url (response)    | string      |  — | Hosted checkout URL. |
| EVENT_HASH (callback)     | string      |  — | MD5 of concatenated fields + private key + timestamp. |
| EVENT_TIME (callback)     | integer     |  — | Unix epoch seconds (replay protection). |
| MODE (callback)           | string      |  — | "live" means mainnet. |
| status (invoice)          | int/string  |  — | Example: 10 ⇒ **paid**. |

---

## 10) Security & Best Practices

- **Private key is displayed only once**; store securely and revoke/rotate on exposure.
- **HTTPS** for all API and webhook traffic.
- **Rotate keys**, separate by environment/gateway.
- **Idempotency** via client_order_identifier.
- **Always verify EVENT_HASH** and guard against replay.
- **Log** request IDs and results; avoid logging secrets.

---

End of EasyBitPay API Documentation`

  try {
    await navigator.clipboard.writeText(llmContent)
    copyButtonText.value = 'Copied!'
    copyButtonIcon.value = 'check'
    
    setTimeout(() => {
      copyButtonText.value = 'Copy for LLM'
      copyButtonIcon.value = 'copy'
    }, 2000)
  } catch (err) {
    copyButtonText.value = 'Failed to copy'
    setTimeout(() => {
      copyButtonText.value = 'Copy for LLM'
    }, 2000)
  }
}

onMounted(() => {
  const scrollSpy = new ScrollSpy(document.body, {
    target: '#knowledge-nav',
    offset: 100
  })
  scrollSpy.refresh()
  Prism.highlightAll()

  // Handle code tab switching
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = button.dataset.target
      const parent = button.closest('.code-tabs')
      
      // Update buttons
      parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')
      
      // Update panes
      parent.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'))
      parent.querySelector(`#${target}`).classList.add('active')
      
      // Re-highlight code
      Prism.highlightAll()
    })
  })
})
</script>

<template>
  <div class="api-docs-container">
    <div class="docs-content">
      <!-- Header -->
      <div class="docs-header" id="overview">
        <div class="header-top">
          <div>
            <h1 class="docs-title">EasyBitPay API</h1>
            <p class="docs-subtitle">Developer Documentation — v3</p>
          </div>
          <button class="btn-copy-llm" @click="copyForLLM">
            <svg v-if="copyButtonIcon === 'copy'" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="6" width="10" height="10" rx="2" ry="2"/>
              <path d="M12 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 5 7 15 2 10"/>
            </svg>
            <span>{{ copyButtonText }}</span>
          </button>
        </div>
        <div class="info-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
            <path d="M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
          </svg>
          <span><strong>Scope:</strong> Merchant-facing API to create invoices and track crypto payments with EasyBitPay</span>
        </div>
        <div class="info-badge success">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 01.02-.022z"/>
          </svg>
          <span><strong>What's new in v3:</strong> Key management, webhook verification (EVENT_HASH), status mapping, environment clarifications</span>
        </div>
      </div>

      <!-- 1. Concepts & Environments -->
      <section class="docs-section" id="concepts">
        <h2 class="section-title">1. Concepts & Environments</h2>
        
        <div class="subsection" id="environments">
          <h3>Environments</h3>
          <div class="env-cards">
            <div class="env-card">
              <div class="env-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                <h4>Mainnet (Production)</h4>
              </div>
              <code>https://api.easybitpay.com</code>
              <p>Callback MODE: <span class="badge-inline live">live</span></p>
            </div>
            <div class="env-card">
              <div class="env-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                </svg>
                <h4>Sandbox (Testing)</h4>
              </div>
              <code>https://api-sandbox.easybitpay.com</code>
              <p>No real token movement</p>
            </div>
          </div>
        </div>

        <div class="subsection" id="flow">
          <h3>Account Setup & Flow</h3>
          <ol class="flow-steps">
            <li><strong>Register</strong> in the EasyBitPay panel</li>
            <li><strong>Create a gateway</strong> (configure name, image, banner)</li>
            <li><strong>Generate an API key</strong> for that gateway (merchants can manage multiple gateways)</li>
            <li><strong>Validate your site/domain</strong> — once validated, the API key activates</li>
            <li><strong>Create invoices</strong> from the panel or via API</li>
            <li><strong>Redirect customers</strong> to the hosted checkout <code>payment_url</code></li>
            <li><strong>Receive callbacks</strong> on your callback URL with payment events</li>
            <li><strong>Verify</strong> callback authenticity using <code>EVENT_HASH</code>, then update your order state</li>
          </ol>
        </div>

        <div class="subsection" id="tokens">
          <h3>Tokens</h3>
          <p>You may pass <strong>token IDs</strong> or <strong>token names/symbols</strong> (e.g., <code>USDT</code>, <code>TRX</code>, <code>USDT-POLYGON</code>, <code>ECG-Binance</code>).</p>
          <p>Use <code>available_tokens</code> to restrict which tokens the end-user can choose at checkout.</p>
        </div>
      </section>

      <!-- 2. Authentication -->
      <section class="docs-section" id="authentication">
        <h2 class="section-title">2. Authentication</h2>
        <p>Every request must include your gateway key:</p>
        <pre class="code-block"><code>X-API-Key: &lt;YOUR_API_KEY&gt;</code></pre>
        <div class="warning-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 01-1.1 0L7.1 5.995A.905.905 0 018 5zm.002 6a1 1 0 110 2 1 1 0 010-2z"/>
          </svg>
          <div>
            <strong>Security Note:</strong> Use different keys for sandbox vs production. Never expose keys in frontend code or public repos.
          </div>
        </div>
      </section>

      <!-- 3. Base URLs -->
      <section class="docs-section" id="base-urls">
        <h2 class="section-title">3. Base URLs</h2>
        <div class="url-table">
          <div class="url-row">
            <div class="url-label">Mainnet</div>
            <div class="url-value"><code>https://api.easybitpay.com</code></div>
          </div>
          <div class="url-row">
            <div class="url-label">Sandbox</div>
            <div class="url-value"><code>https://api-sandbox.easybitpay.com</code></div>
          </div>
        </div>
        <p class="note">All endpoints described below are relative to these base URLs.</p>
      </section>

      <!-- 4. Key Management -->
      <section class="docs-section" id="key-management">
        <h2 class="section-title">4. Key Management (Public / Private Keys)</h2>
        <p>When you generate a <strong>public key</strong> in the panel, the system <strong>also generates a matching private key</strong>. This private key is used to <strong>confirm data authenticity</strong> (e.g., to build/verify <code>EVENT_HASH</code> in callbacks).</p>
        
        <div class="key-points">
          <div class="key-point">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
              <path d="M10.97 4.97a.235.235 0 00-.02.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-1.071-1.05z"/>
            </svg>
            <span>The <strong>private key is shown only once</strong> at creation time. Store it securely (HSM, vault, KMS).</span>
          </div>
          <div class="key-point">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
              <path d="M10.97 4.97a.235.235 0 00-.02.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-1.071-1.05z"/>
            </svg>
            <span>If you lose it, <strong>revoke</strong> the key pair and generate a new one; the previous private key cannot be retrieved again.</span>
          </div>
          <div class="key-point">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
              <path d="M10.97 4.97a.235.235 0 00-.02.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-1.071-1.05z"/>
            </svg>
            <span>Rotate keys periodically and after any suspected compromise.</span>
          </div>
          <div class="key-point">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
              <path d="M10.97 4.97a.235.235 0 00-.02.022L7.477 9.417 5.384 7.323a.75.75 0 00-1.06 1.06L6.97 11.03a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 00-1.071-1.05z"/>
            </svg>
            <span>Keep separate key pairs per environment (sandbox vs mainnet).</span>
          </div>
        </div>

        <p class="note">You will also configure a <strong>Callback URL</strong> in the gateway settings. EasyBitPay will send payment notifications there.</p>
      </section>

      <!-- 5. Invoices API -->
      <section class="docs-section" id="invoices-api">
        <h2 class="section-title">5. Invoices API</h2>
        
        <div class="subsection" id="create-invoice">
          <h3>5.1 Create Invoice</h3>
          <div class="endpoint-card">
            <div class="endpoint-method post">POST</div>
            <div class="endpoint-path">/invoices</div>
          </div>
          <p>Create a new invoice. Pass the <strong>base token</strong> (by name or ID), charge amount, a description, and your internal order ID (<code>client_order_identifier</code>).</p>
          
          <h4 class="code-title">Headers</h4>
          <pre class="code-block"><code>X-API-Key: &lt;YOUR_API_KEY&gt;
Content-Type: application/json</code></pre>

          <h4 class="code-title">Request Body</h4>
          <div class="code-tabs">
            <div class="tabs-header">
              <button class="tab-btn active" data-target="create-json">JSON</button>
              <button class="tab-btn" data-target="create-curl">cURL</button>
              <button class="tab-btn" data-target="create-php">PHP</button>
            </div>
            <div class="tabs-content">
              <div class="tab-pane active" id="create-json">
                <pre class="language-json"><code>{{ createInvoiceJSON }}</code></pre>
              </div>
              <div class="tab-pane" id="create-curl">
                <pre class="language-bash"><code>{{ curlExample }}</code></pre>
              </div>
              <div class="tab-pane" id="create-php">
                <pre class="language-php"><code>{{ phpExample }}</code></pre>
              </div>
            </div>
          </div>

          <h4 class="code-title">Response</h4>
          <pre class="language-json"><code>{{ createInvoiceResponse }}</code></pre>
          
          <div class="info-box">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 11-2 0 1 1 0 012 0z"/>
            </svg>
            <div>
              <strong>Next step:</strong> Redirect your customer to <code>payment_url</code>
            </div>
          </div>
        </div>

        <div class="subsection" id="get-invoice">
          <h3>5.2 Get Invoice (Details)</h3>
          <div class="endpoint-card">
            <div class="endpoint-method get">GET</div>
            <div class="endpoint-path">/invoices/{code}</div>
          </div>
          <p>Retrieve invoice by its short unique <code>code</code>.</p>
        </div>

        <div class="subsection" id="get-status">
          <h3>5.3 Get Payment Status</h3>
          <div class="endpoint-card">
            <div class="endpoint-method get">GET</div>
            <div class="endpoint-path">/invoices/status/{code}</div>
          </div>
          <p>Fetch the latest payment status for the invoice <code>code</code>.</p>
          
          <h4>Typical Statuses</h4>
          <div class="status-badges">
            <span class="status-badge pending">pending</span>
            <span class="status-badge paid">paid</span>
            <span class="status-badge confirmed">confirmed</span>
            <span class="status-badge failed">failed / expired</span>
          </div>
          
          <div class="note-box">
            <strong>Note:</strong> In some responses you may see numeric status codes. For example, <code>status: 10</code> means <strong>paid</strong>.
          </div>
        </div>
      </section>

      <!-- 6. Callbacks / Webhooks -->
      <section class="docs-section" id="callbacks">
        <h2 class="section-title">6. Callbacks / Webhooks</h2>
        
        <div class="subsection" id="configure-callback">
          <h3>6.1 Configure Callback URL</h3>
          <p>In the gateway settings, define your <strong>Callback URL</strong> (HTTPS). EasyBitPay will send notifications (e.g., <code>PAYMENT_SUCCESS</code>) to this endpoint whenever an invoice's state changes.</p>
        </div>

        <div class="subsection" id="callback-payload">
          <h3>6.2 Sample Callback Payload</h3>
          <p>Below is an example payload you may receive from EasyBitPay:</p>
          <pre class="language-json"><code>{{ callbackPayload }}</code></pre>
          
          <div class="key-points">
            <div class="key-point">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="7" r="6"/>
              </svg>
              <span><code>MODE: "live"</code> ⇒ <strong>mainnet</strong></span>
            </div>
            <div class="key-point">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="7" r="6"/>
              </svg>
              <span><code>status: 10</code> in <code>EVENT_DATA.invoice</code> ⇒ <strong>paid</strong></span>
            </div>
            <div class="key-point">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="7" r="6"/>
              </svg>
              <span><code>EVENT_TYPE</code> e.g., <code>PAYMENT_SUCCESS</code> — route business logic accordingly</span>
            </div>
          </div>
        </div>

        <div class="subsection" id="verify-callback">
          <h3>6.3 Verifying Callback Authenticity (EVENT_HASH)</h3>
          <p>Each callback includes <code>EVENT_HASH</code>. Use it to ensure the payload truly comes from EasyBitPay.</p>
          
          <h4 class="code-title">Hash Verification Algorithm</h4>
          <pre class="language-javascript"><code>{{ verifyHashPseudo }}</code></pre>

          <div class="warning-box">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 01-1.1 0L7.1 5.995A.905.905 0 018 5zm.002 6a1 1 0 110 2 1 1 0 010-2z"/>
            </svg>
            <div>
              <strong>Best Practices:</strong>
              <ul>
                <li>Store your <strong>private key</strong> in a secure secrets manager (not in code)</li>
                <li>Enforce <strong>replay protection</strong> using <code>EVENT_TIME</code> (reject old timestamps and duplicates)</li>
                <li><strong>Constant-time</strong> compare for hashes</li>
                <li>After accepting a valid callback, <strong>fetch current invoice</strong> (optional) and confirm state before finalizing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Sandbox Utilities -->
      <section class="docs-section" id="sandbox">
        <h2 class="section-title">7. Sandbox Utilities</h2>
        <div class="endpoint-card">
          <div class="endpoint-method post">POST</div>
          <div class="endpoint-path">/invoices/update-status/{code}</div>
          <span class="endpoint-badge">Sandbox Only</span>
        </div>
        <p>Simulate <code>pay</code>, <code>cancel</code>, <code>expire</code> to test webhooks and state transitions.</p>
      </section>

      <!-- 8. Withdraw API -->
      <section class="docs-section" id="withdraw">
        <h2 class="section-title">8. Withdraw (Separate API)</h2>
        <div class="endpoint-card">
          <div class="endpoint-method get">GET</div>
          <div class="endpoint-path">https://withdraw.api.easybitpay.com/withdraw</div>
        </div>
        <p>Separate from invoices; may require different auth.</p>
      </section>

      <!-- 9. Data Model -->
      <section class="docs-section" id="data-model">
        <h2 class="section-title">9. Data Model & Parameters</h2>
        <div class="params-table">
          <div class="params-header">
            <div>Field</div>
            <div>Type</div>
            <div>Required</div>
            <div>Notes</div>
          </div>
          <div class="params-row">
            <div><code>base_token</code></div>
            <div>string/int</div>
            <div><span class="required">✓</span></div>
            <div>Base token by name/symbol (e.g., <code>USDT</code>) or ID</div>
          </div>
          <div class="params-row">
            <div><code>amount</code></div>
            <div>number/str</div>
            <div><span class="required">✓</span></div>
            <div>Amount to charge in base token</div>
          </div>
          <div class="params-row">
            <div><code>available_tokens</code></div>
            <div>string</div>
            <div>—</div>
            <div>CSV list of tokens/networks (e.g., <code>TRX,USDT-POLYGON</code>)</div>
          </div>
          <div class="params-row">
            <div><code>description</code></div>
            <div>string</div>
            <div>—</div>
            <div>Human-readable invoice description</div>
          </div>
          <div class="params-row">
            <div><code>client_order_identifier</code></div>
            <div>string</div>
            <div>—</div>
            <div>Your order ID (idempotency)</div>
          </div>
          <div class="params-row">
            <div><code>code</code></div>
            <div>string</div>
            <div>—</div>
            <div>Short unique invoice code (response)</div>
          </div>
          <div class="params-row">
            <div><code>payment_url</code></div>
            <div>string</div>
            <div>—</div>
            <div>Hosted checkout URL (response)</div>
          </div>
          <div class="params-row">
            <div><code>EVENT_HASH</code></div>
            <div>string</div>
            <div>—</div>
            <div>MD5 of concatenated fields + private key + timestamp (callback)</div>
          </div>
          <div class="params-row">
            <div><code>EVENT_TIME</code></div>
            <div>integer</div>
            <div>—</div>
            <div>Unix epoch seconds (replay protection, callback)</div>
          </div>
          <div class="params-row">
            <div><code>MODE</code></div>
            <div>string</div>
            <div>—</div>
            <div><code>"live"</code> means mainnet (callback)</div>
          </div>
          <div class="params-row">
            <div><code>status</code></div>
            <div>int/string</div>
            <div>—</div>
            <div>Example: <code>10</code> ⇒ <strong>paid</strong></div>
          </div>
        </div>
      </section>

      <!-- 10. Security Best Practices -->
      <section class="docs-section" id="security">
        <h2 class="section-title">10. Security & Best Practices</h2>
        <div class="security-grid">
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <h4>Private Key Security</h4>
            <p>Private key is displayed only once; store securely and revoke/rotate on exposure</p>
          </div>
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h4>HTTPS Only</h4>
            <p>Use HTTPS for all API and webhook traffic</p>
          </div>
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h4>Key Rotation</h4>
            <p>Rotate keys periodically, separate by environment/gateway</p>
          </div>
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h4>Idempotency</h4>
            <p>Use <code>client_order_identifier</code> for idempotent operations</p>
          </div>
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h4>Verify Callbacks</h4>
            <p>Always verify <code>EVENT_HASH</code> and guard against replay attacks</p>
          </div>
          <div class="security-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h4>Logging</h4>
            <p>Log request IDs and results; avoid logging secrets</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Sidebar Navigation -->
    <div class="docs-sidebar">
      <nav id="knowledge-nav" class="sidebar-nav">
        <div class="nav-section">
          <a class="nav-link" href="#overview" @click.prevent="scrollToId('overview')">Overview</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#concepts" @click.prevent="scrollToId('concepts')">1. Concepts</a>
          <div class="nav-children">
            <a class="nav-link-child" href="#environments" @click.prevent="scrollToId('environments')">Environments</a>
            <a class="nav-link-child" href="#flow" @click.prevent="scrollToId('flow')">Account Flow</a>
            <a class="nav-link-child" href="#tokens" @click.prevent="scrollToId('tokens')">Tokens</a>
          </div>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#authentication" @click.prevent="scrollToId('authentication')">2. Authentication</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#base-urls" @click.prevent="scrollToId('base-urls')">3. Base URLs</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#key-management" @click.prevent="scrollToId('key-management')">4. Key Management</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#invoices-api" @click.prevent="scrollToId('invoices-api')">5. Invoices API</a>
          <div class="nav-children">
            <a class="nav-link-child" href="#create-invoice" @click.prevent="scrollToId('create-invoice')">Create Invoice</a>
            <a class="nav-link-child" href="#get-invoice" @click.prevent="scrollToId('get-invoice')">Get Invoice</a>
            <a class="nav-link-child" href="#get-status" @click.prevent="scrollToId('get-status')">Get Status</a>
          </div>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#callbacks" @click.prevent="scrollToId('callbacks')">6. Callbacks</a>
          <div class="nav-children">
            <a class="nav-link-child" href="#configure-callback" @click.prevent="scrollToId('configure-callback')">Configure</a>
            <a class="nav-link-child" href="#callback-payload" @click.prevent="scrollToId('callback-payload')">Payload</a>
            <a class="nav-link-child" href="#verify-callback" @click.prevent="scrollToId('verify-callback')">Verification</a>
          </div>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#sandbox" @click.prevent="scrollToId('sandbox')">7. Sandbox</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#withdraw" @click.prevent="scrollToId('withdraw')">8. Withdraw</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#data-model" @click.prevent="scrollToId('data-model')">9. Data Model</a>
        </div>
        <div class="nav-section">
          <a class="nav-link" href="#security" @click.prevent="scrollToId('security')">10. Security</a>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.api-docs-container {
  display: flex;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
  }
}

.docs-content {
  flex: 1;
  min-width: 0;
}

.docs-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.btn-copy-llm {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.docs-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
}

.docs-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.info-badge {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  &.success {
    background: #f0fdf4;
    border-color: #86efac;
    color: #065f46;
  }
}

.docs-section {
  margin-bottom: 4rem;
  scroll-margin-top: 2rem;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1.5px solid #e5e7eb;
  letter-spacing: -0.02em;
}

.subsection {
  margin-bottom: 2.5rem;
  scroll-margin-top: 2rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 1.5rem 0 0.75rem 0;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: #374151;
    margin-bottom: 1rem;
  }
}

.env-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.env-card {
  padding: 1.5rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;

  .env-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    svg {
      color: #6366f1;
    }

    h4 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }
  }

  code {
    display: block;
    padding: 0.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #6366f1;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}

.badge-inline {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  background: #10b981;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;

  &.live {
    background: #10b981;
  }
}

.flow-steps {
  padding-left: 1.5rem;
  margin: 1.5rem 0;

  li {
    font-size: 0.9375rem;
    line-height: 1.8;
    color: #374151;
    margin-bottom: 0.5rem;

    strong {
      color: #111827;
      font-weight: 600;
    }

    code {
      font-size: 0.875rem;
      padding: 0.125rem 0.375rem;
      background: #f3f4f6;
      border-radius: 0.25rem;
      color: #6366f1;
    }
  }
}

code {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 0.125rem 0.375rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  color: #6366f1;
}

.code-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-size: 0.875rem;
  line-height: 1.6;

  code {
    background: transparent;
    color: inherit;
    padding: 0;
  }
}

.code-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0 0.5rem 0;
}

.code-tabs {
  margin: 1rem 0;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;

  .tabs-header {
    display: flex;
    background: #f9fafb;
    border-bottom: 1.5px solid #e5e7eb;
  }

  .tab-btn {
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: none;
    border-right: 1px solid #e5e7eb;
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;

    &:last-child {
      border-right: none;
    }

    &:hover {
      background: #f3f4f6;
      color: #374151;
    }

    &.active {
      background: white;
      color: #6366f1;
      font-weight: 600;
    }
  }

  .tabs-content {
    background: #1e293b;
  }

  .tab-pane {
    display: none;

    &.active {
      display: block;
    }

    pre {
      margin: 0;
      padding: 1.25rem;
      background: transparent;
    }
  }
}

.warning-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
  color: #92400e;
  margin: 1.5rem 0;
  font-size: 0.9375rem;
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.25rem;

    li {
      margin-bottom: 0.375rem;
    }
  }
}

.info-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;
  margin: 1.5rem 0;
  font-size: 0.9375rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
}

.note-box, .note {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-left: 3px solid #6366f1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  margin: 1rem 0;
}

.url-table {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  margin: 1.5rem 0;

  .url-row {
    display: flex;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .url-label {
      width: 120px;
      font-weight: 600;
      color: #111827;
      font-size: 0.9375rem;
    }

    .url-value {
      flex: 1;

      code {
        font-size: 0.875rem;
      }
    }
  }
}

.key-points {
  margin: 1.5rem 0;

  .key-point {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #374151;

    svg {
      flex-shrink: 0;
      margin-top: 0.25rem;
      color: #10b981;
    }

    strong {
      color: #111827;
    }

    code {
      font-size: 0.875rem;
    }
  }
}

.endpoint-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  margin: 1rem 0;

  .endpoint-method {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &.get {
      background: #dbeafe;
      color: #1e40af;
    }

    &.post {
      background: #d1fae5;
      color: #065f46;
    }
  }

  .endpoint-path {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 0.9375rem;
    color: #111827;
    font-weight: 500;
  }

  .endpoint-badge {
    margin-left: auto;
    padding: 0.25rem 0.625rem;
    background: #fef3c7;
    color: #92400e;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
  }
}

.status-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;

    &.pending {
      background: #fef3c7;
      color: #92400e;
    }

    &.paid {
      background: #dbeafe;
      color: #1e40af;
    }

    &.confirmed {
      background: #d1fae5;
      color: #065f46;
    }

    &.failed {
      background: #fee2e2;
      color: #991b1b;
    }
  }
}

.params-table {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  margin: 1.5rem 0;

  .params-header {
    display: grid;
    grid-template-columns: 200px 120px 100px 1fr;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background: #f9fafb;
    border-bottom: 1.5px solid #e5e7eb;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .params-row {
    display: grid;
    grid-template-columns: 200px 120px 100px 1fr;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.875rem;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    code {
      font-size: 0.8125rem;
    }

    .required {
      color: #10b981;
      font-weight: 600;
    }
  }
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;

  .security-card {
    padding: 1.5rem;
    background: white;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    transition: all 0.2s ease;

    &:hover {
      border-color: #6366f1;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
    }

    svg {
      color: #6366f1;
      margin-bottom: 1rem;
    }

    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    p {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #6b7280;
      margin: 0;

      code {
        font-size: 0.8125rem;
      }
    }
  }
}

.docs-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .nav-section {
    margin-bottom: 0.5rem;
  }

  .nav-link {
    display: block;
    padding: 0.5rem 0.75rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: all 0.15s ease;

    &:hover {
      background: #f9fafb;
      color: #111827;
    }

    &.active {
      background: #eff6ff;
      color: #6366f1;
      font-weight: 600;
    }
  }

  .nav-children {
    margin-left: 1rem;
    margin-top: 0.25rem;
    border-left: 2px solid #f3f4f6;
    padding-left: 0.75rem;
  }

  .nav-link-child {
    display: block;
    padding: 0.375rem 0.75rem;
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.8125rem;
    border-radius: 0.375rem;
    transition: all 0.15s ease;

    &:hover {
      background: #f9fafb;
      color: #6b7280;
    }

    &.active {
      background: #eff6ff;
      color: #6366f1;
      font-weight: 500;
    }
  }
}

// Code highlighting (Prism.js overrides)
pre[class*="language-"] {
  margin: 0;
  background: #1e293b;
  color: #e2e8f0;
  
  code {
    background: transparent;
    color: inherit;
  }
}

// Scrollbar styling
.docs-sidebar::-webkit-scrollbar {
  width: 6px;
}

.docs-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.docs-sidebar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.docs-sidebar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
