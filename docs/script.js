// Localization strings
const DEFAULT_LANGUAGE = 'en';

// Query parameter constants
const QUERY_PARAM_LANG = 'lang';
const QUERY_PARAM_EDIT = 'edit';
const QUERY_PARAM_EDIT_VALUE = 'true';

// Query parameters that don't represent permalink data
const NON_PERMALINK_QUERY_PARAMS = [QUERY_PARAM_LANG, QUERY_PARAM_EDIT];

// Theme management
const THEME_STORAGE_KEY = 'iban-ad-theme';
const THEME_SYSTEM = 'system';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
}

function getCurrentTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored || THEME_SYSTEM;
}

function applyTheme(theme) {
    const effectiveTheme = theme === THEME_SYSTEM ? getSystemTheme() : theme;
    const html = document.documentElement;

    if (effectiveTheme === THEME_DARK) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

function setTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(currentTheme) {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        const isActive = btn.dataset.theme === currentTheme;
        btn.setAttribute('aria-checked', isActive);
        if (isActive) {
            btn.setAttribute('data-checked', '');
        } else {
            btn.removeAttribute('data-checked');
        }
    });
}

function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    updateThemeButtons(currentTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getCurrentTheme() === THEME_SYSTEM) {
            applyTheme(THEME_SYSTEM);
        }
    });

    // Add click handlers to theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
}

// Initialize theme before other scripts
initTheme();

const TRANSLATIONS = {
    en: {
        siteName: 'IBAN.ad',
        tagline: 'The easiest way for NGOs, freelancers, and clubs to share their bank details for donations, payments, or memberships.',
        title: 'IBAN Advertiser',
        formDesc: 'Readonly form displaying IBAN and related transaction details.',
        bankingInformationSection: 'Banking Information',
        ibanLabel: 'Currency & IBAN',
        copyIBAN: 'Copy IBAN',
        swiftLabel: 'SWIFT/BIC',
        copySWIFT: 'Copy SWIFT/BIC',
        accountHolderSection: 'Account Holder',
        nameLabel: 'Name',
        copyName: 'Copy Name',
        addressLabel: 'Address',
        copyAddress: 'Copy Address',
        detailsLabel: 'Transaction Details',
        copyDetails: 'Copy Transaction Details',
        edit: 'Edit',
        permalink: 'Share',
        copied: 'Copied!',
        specialCharactersSuggestion: 'Tip: Avoid special characters (á, é, ñ, ü, ç, etc.) for maximum compatibility with all banks.',
        skipToMain: 'Skip to main content',
        themeSystem: 'System theme',
        themeLight: 'Light theme',
        themeDark: 'Dark theme',
        langChanged: 'Language changed to English.',
        formReset: 'Form has been reset.',
        disclaimer: 'Disclaimer: This website does not process payments or donations. It only helps you copy IBAN information to use in your banking app or other payment methods for actual transfers.'
    },
    ro: {
        siteName: 'IBAN.ad',
        tagline: 'Cea mai simplă modalitate pentru ONG-uri, freelanceri și cluburi de a-și partaja contul bancar pentru donații, plăți sau cotizații.',
        title: 'Promotor IBAN',
        formDesc: 'Formular doar pentru citire care afișează IBAN-ul și detaliile tranzacției.',
        bankingInformationSection: 'Informații bancare',
        ibanLabel: 'Monedă și IBAN',
        copyIBAN: 'Copiază IBAN',
        swiftLabel: 'SWIFT/BIC',
        copySWIFT: 'Copiază SWIFT/BIC',
        accountHolderSection: 'Titular cont',
        nameLabel: 'Nume',
        copyName: 'Copiază nume',
        addressLabel: 'Adresă',
        copyAddress: 'Copiază adresă',
        detailsLabel: 'Detalii tranzacție',
        copyDetails: 'Copiază detalii tranzacție',
        edit: 'Modifică',
        permalink: 'Partajează',
        copied: 'Copiat!',
        specialCharactersSuggestion: 'Sfat: Evită caracterele speciale (ă, ș, ț, etc.) pentru compatibilitate maximă cu toate băncile.',
        skipToMain: 'Sari la conținutul principal',
        themeSystem: 'Temă sistem',
        themeLight: 'Temă deschisă',
        themeDark: 'Temă întunecată',
        langChanged: 'Limba a fost schimbată în română.',
        formReset: 'Formularul a fost resetat.',
        disclaimer: 'Precizare: Acest site nu procesează plăți sau donații. Te ajută doar să copiezi informațiile IBAN pentru a le folosi în aplicația ta bancară sau alte metode de plată pentru transferuri reale.'
    }
};

function getTranslations(lang) {
    return TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE];
}

function setLanguage(lang) {
    const t = getTranslations(lang);
    document.title = t.title;
    document.getElementById('clear-form-btn').textContent = t.siteName;
    document.getElementById('site-tagline').textContent = t.tagline;
    // Localize aria-labels for copy buttons
    document.querySelector('.copy-btn[data-row-index="1"]').setAttribute('aria-label', t.copyIBAN);
    document.querySelector('.copy-btn[data-copytarget="name"]').setAttribute('aria-label', t.copyName);
    document.querySelector('.copy-btn[data-copytarget="address"]').setAttribute('aria-label', t.copyAddress);
    document.querySelector('.copy-btn[data-copytarget="details"]').setAttribute('aria-label', t.copyDetails);
    document.querySelector('.copy-btn[data-copytarget="swift"]').setAttribute('aria-label', t.copySWIFT);
    // Localize permalink button label and aria-label
    document.getElementById('permalink-btn-label').textContent = t.permalink;
    document.getElementById('permalink-btn').setAttribute('aria-label', t.permalink);
    // Localize edit button label and aria-label
    document.getElementById('edit-btn-label').textContent = t.edit;
    document.getElementById('edit-btn').setAttribute('aria-label', t.edit);
    // Localize tooltip text
    document.getElementById('tooltip-iban-1').textContent = t.copied;
    document.getElementById('tooltip-name').textContent = t.copied;
    document.getElementById('tooltip-address').textContent = t.copied;
    document.getElementById('tooltip-details').textContent = t.copied;
    document.getElementById('tooltip-swift').textContent = t.copied;
    document.getElementById('tooltip-permalink').textContent = t.copied;
    // Update <html lang=...>
    document.documentElement.setAttribute('lang', lang);
    // Localize skip to main content link
    document.getElementById('skip-link').textContent = t.skipToMain;
    // Localize theme button aria-labels
    document.getElementById('theme-system').setAttribute('aria-label', t.themeSystem);
    document.getElementById('theme-light').setAttribute('aria-label', t.themeLight);
    document.getElementById('theme-dark').setAttribute('aria-label', t.themeDark);
    // Announce language change for screen readers
    announceA11y(t.langChanged);
    document.getElementById('iban-info-title').textContent = t.title;
    document.querySelector('label[for="currency-1"]').textContent = t.ibanLabel;
    document.getElementById('banking-info-section').textContent = t.bankingInformationSection;
    document.getElementById('account-holder-section').textContent = t.accountHolderSection;
    document.querySelector('label[for="name"]').textContent = t.nameLabel;
    document.querySelector('label[for="address"]').textContent = t.addressLabel;
    document.querySelector('label[for="details"]').textContent = t.detailsLabel;
    document.querySelector('label[for="swift"]').textContent = t.swiftLabel;
    document.getElementById('iban-info-desc').textContent = t.formDesc;
    document.getElementById('disclaimer-text').textContent = t.disclaimer;
    document.getElementById('name-suggestion').textContent = t.specialCharactersSuggestion;
    document.getElementById('address-suggestion').textContent = t.specialCharactersSuggestion;
    document.getElementById('details-suggestion').textContent = t.specialCharactersSuggestion;
}

document.getElementById('lang-select').addEventListener('change', function(e) {
    setLanguage(e.target.value);
});

// Set default language
setLanguage(document.getElementById('lang-select').value);

// State management for read-only mode
function hasPermalinkData() {
    const params = new URLSearchParams(window.location.search);
    // Check if any form field parameters are present (excluding non-permalink params)
    for (const [key] of params) {
        if (!NON_PERMALINK_QUERY_PARAMS.includes(key)) {
            return true;
        }
    }
    return false;
}

function isEditMode() {
    const params = new URLSearchParams(window.location.search);
    return params.has(QUERY_PARAM_EDIT) && params.get(QUERY_PARAM_EDIT) === QUERY_PARAM_EDIT_VALUE;
}

function isReadOnlyMode() {
    return hasPermalinkData() && !isEditMode();
}

function hasDataToShare() {
    // Check if there's meaningful data in the current form that can be shared
    const swiftVal = document.getElementById('swift').value.trim();
    const nameVal = document.getElementById('name').value.trim();
    const addressVal = document.getElementById('address').value.trim();
    const detailsVal = document.getElementById('details').value.trim();

    if (swiftVal || nameVal || addressVal || detailsVal) {
        return true;
    }

    // Check all IBAN rows for meaningful data
    const allRows = document.querySelectorAll('.iban-row');
    for (const row of allRows) {
        const rowIndex = parseInt(row.getAttribute('data-row-index'));
        const currencyField = document.getElementById(`currency-${rowIndex}`);
        const ibanField = document.getElementById(`iban-${rowIndex}`);

        if (currencyField && ibanField) {
            const currencyValue = currencyField.value.trim();
            const ibanValue = ibanField.value.trim();

            if (currencyValue || ibanValue) {
                return true;
            }
        }
    }

    return false;
}

function setFieldsReadOnly(readOnly) {
    // Set readonly state and styling for all input fields and textareas
    const allFields = document.querySelectorAll('input[type="text"], textarea');
    allFields.forEach(field => {
        // Set readonly property
        field.readOnly = readOnly;

        // Update visual styling
        if (readOnly) {
            field.setAttribute('tabindex', '-1');
        } else {
            field.removeAttribute('tabindex');
        }
    });
}

// Function to hide empty fields in read-only mode
function setFieldVisibility(readOnly) {
    if (!readOnly) {
        // In edit mode, show all fields
        showAllFields();
        return;
    }

    // Hide empty individual fields in read-only mode
    const fieldsToCheck = ['swift', 'name', 'address', 'details'];
    fieldsToCheck.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const hasValue = field.value.trim();
            const fieldContainer = field.closest('div').parentElement; // Get the label + input container
            
            if (hasValue) {
                fieldContainer.classList.remove('hidden');
            } else {
                fieldContainer.classList.add('hidden');
            }
        }
    });

    // Handle IBAN rows - hide empty rows except the first one
    const allRows = document.querySelectorAll('.iban-row');
    allRows.forEach(row => {
        const rowIndex = parseInt(row.getAttribute('data-row-index'));
        const currencyField = document.getElementById(`currency-${rowIndex}`);
        const ibanField = document.getElementById(`iban-${rowIndex}`);
        
        if (currencyField && ibanField) {
            const currencyValue = currencyField.value.trim();
            const ibanValue = ibanField.value.trim();
            
            // Always show the first row, even if empty (for context)
            if (rowIndex === 1) {
                row.classList.remove('hidden');
                // But hide the currency field if it's empty and IBAN has content
                if (!currencyValue && ibanValue) {
                    currencyField.classList.add('hidden');
                } else {
                    currencyField.classList.remove('hidden');
                }
            } else {
                // Hide additional rows if they are completely empty
                if (!currencyValue && !ibanValue) {
                    row.classList.add('hidden');
                } else {
                    row.classList.remove('hidden');
                    // Hide currency field if empty but IBAN has content
                    if (!currencyValue && ibanValue) {
                        currencyField.classList.add('hidden');
                    } else {
                        currencyField.classList.remove('hidden');
                    }
                }
            }
        }
    });

    // Hide SWIFT field if empty
    const swiftField = document.getElementById('swift');
    const swiftContainer = swiftField ? swiftField.closest('div').parentElement : null;
    if (swiftContainer) {
        if (swiftField.value.trim()) {
            swiftContainer.classList.remove('hidden');
        } else {
            swiftContainer.classList.add('hidden');
        }
    }

    // Check if Account Holder fieldset should be hidden (if both name and address are empty)
    const nameField = document.getElementById('name');
    const addressField = document.getElementById('address');
    const accountHolderFieldset = document.querySelector('fieldset[aria-labelledby="account-holder-section"]');
    
    if (accountHolderFieldset && nameField && addressField) {
        const hasNameValue = nameField.value.trim();
        const hasAddressValue = addressField.value.trim();
        
        if (!hasNameValue && !hasAddressValue) {
            accountHolderFieldset.classList.add('hidden');
        } else {
            accountHolderFieldset.classList.remove('hidden');
        }
    }
}

function showAllFields() {
    // Show all field containers
    const fieldsToShow = ['swift', 'name', 'address', 'details'];
    fieldsToShow.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const fieldContainer = field.closest('div').parentElement;
            fieldContainer.classList.remove('hidden');
        }
    });

    // Show all IBAN rows and currency fields
    const allRows = document.querySelectorAll('.iban-row');
    allRows.forEach(row => {
        row.classList.remove('hidden');
        const rowIndex = parseInt(row.getAttribute('data-row-index'));
        const currencyField = document.getElementById(`currency-${rowIndex}`);
        if (currencyField) {
            currencyField.classList.remove('hidden');
        }
    });

    // Show SWIFT field
    const swiftField = document.getElementById('swift');
    const swiftContainer = swiftField ? swiftField.closest('div').parentElement : null;
    if (swiftContainer) {
        swiftContainer.classList.remove('hidden');
    }

    // Show Account Holder fieldset
    const accountHolderFieldset = document.querySelector('fieldset[aria-labelledby="account-holder-section"]');
    if (accountHolderFieldset) {
        accountHolderFieldset.classList.remove('hidden');
    }
}

// Unified tooltip notification function
function showTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.setAttribute('data-visible', '');
        setTimeout(() => {
            tooltip.removeAttribute('data-visible');
        }, 2000);
    }
}

// Copy to clipboard logic for all fields
function copyWithFeedback(btn, value) {
    navigator.clipboard.writeText(value).then(() => {
        // Get the tooltip ID based on the button's data-copytarget and row index
        const targetId = btn.getAttribute('data-copytarget');
        const rowIndex = btn.getAttribute('data-row-index');
        let tooltipId;

        // Determine tooltip ID based on button type:
        // - For IBAN copy buttons (have row-index): use tooltip-iban-{rowIndex}
        // - For other copy buttons (non-IBAN fields): use tooltip-{targetId}
        if (rowIndex !== null) {
            tooltipId = `tooltip-iban-${rowIndex}`;
        } else {
            tooltipId = `tooltip-${targetId}`;
        }

        showTooltip(tooltipId);
    });
}

// Helper function to get copy value from button attributes
function getCopyValueFromButton(button) {
    const targetId = button.getAttribute('data-copytarget');
    const rowIndex = button.getAttribute('data-row-index');

    // Check if this is an IBAN row copy button (has data-row-index)
    if (rowIndex !== null) {
        const ibanField = document.getElementById(`iban-${rowIndex}`);
        return ibanField ? ibanField.value.trim() : '';
    }

    // This is a regular field copy button (non-IBAN field)
    const targetField = document.getElementById(targetId);
    return targetField ? targetField.value.trim() : '';
}

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (btn.disabled) return;

        const value = getCopyValueFromButton(btn);

        copyWithFeedback(btn, value);
    });
});

// Handle dynamically added copy buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn') && !e.target.hasAttribute('data-listener-added')) {
        e.target.setAttribute('data-listener-added', 'true');

        if (e.target.disabled) return;

        const value = getCopyValueFromButton(e.target);

        copyWithFeedback(e.target, value);
    }
});

// Function to get the next available row index (stable indexing: 1, 2, 3, ...)
function getNextRowIndex() {
    const existingRows = document.querySelectorAll('.iban-row');
    return existingRows.length + 1; // 1, 2, 3, ...
}



// Helper function to find the last row index (using fixed indices)
function getLastRowIndex() {
    const allRows = document.querySelectorAll('.iban-row');
    if (allRows.length === 0) return -1;

    let maxIndex = -1;
    allRows.forEach(row => {
        const index = parseInt(row.getAttribute('data-row-index'));
        if (index > maxIndex) {
            maxIndex = index;
        }
    });
    return maxIndex;
}

// Helper function to set button state (enabled/disabled) with consistent styling
function setButtonState(button, enabled) {
    if (!button) return;

    button.disabled = !enabled;
}

// Unified button state management for all buttons
function setAllButtonStates() {
    const allRows = document.querySelectorAll('.iban-row');
    const lastRowIndex = getLastRowIndex();
    const readOnly = isReadOnlyMode();

    // Update IBAN row buttons (copy, add, delete)
    allRows.forEach(row => {
        const rowIndex = parseInt(row.getAttribute('data-row-index'));
        const currencyField = document.getElementById(`currency-${rowIndex}`);
        const ibanField = document.getElementById(`iban-${rowIndex}`);
        const addBtn = document.querySelector(`.add-row-btn[data-row-index="${rowIndex}"]`);
        const copyBtn = document.querySelector(`.copy-btn[data-row-index="${rowIndex}"]`);
        const deleteBtn = document.querySelector(`.delete-row-btn[data-row-index="${rowIndex}"]`);

        if (currencyField && ibanField) {
            // Update copy button - enable if IBAN has content (currency is optional)
            if (copyBtn) {
                const shouldEnable = ibanField.value.trim();
                setButtonState(copyBtn, shouldEnable);
            }

            // Update add button - show only on last row when both fields are filled (and not in read-only mode)
            if (addBtn) {
                if (!readOnly && rowIndex === lastRowIndex && currencyField.value.trim() && ibanField.value.trim()) {
                    addBtn.classList.remove('hidden');
                    addBtn.classList.add('flex');
                } else {
                    addBtn.classList.remove('flex');
                    addBtn.classList.add('hidden');
                }
            }

            // Update delete button - show only on last row, never on first row (and not in read-only mode)
            if (deleteBtn) {
                if (!readOnly && rowIndex === lastRowIndex && rowIndex > 1) {
                    deleteBtn.classList.remove('hidden');
                    deleteBtn.classList.add('flex');
                } else {
                    deleteBtn.classList.remove('flex');
                    deleteBtn.classList.add('hidden');
                }
            }
        }
    });

    // Update copy buttons for other fields
    ['swift', 'name', 'address', 'details'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const btn = document.querySelector(`.copy-btn[data-copytarget="${fieldId}"]`);
        if (btn && field) {
            const hasValue = field.value.trim();
            setButtonState(btn, hasValue);
        }
    });

    // Update footer buttons (edit/permalink) - mutually exclusive
    const editBtn = document.getElementById('edit-btn');
    const permalinkBtn = document.getElementById('permalink-btn');

    if (readOnly) {
        // Read-only mode: show edit button, hide permalink button
        if (editBtn) {
            editBtn.classList.remove('hidden');
            editBtn.classList.add('flex');
        }
        if (permalinkBtn) {
            permalinkBtn.classList.remove('flex');
            permalinkBtn.classList.add('hidden');
        }
    } else {
        // Edit mode: show permalink button, hide edit button
        if (editBtn) {
            editBtn.classList.remove('flex');
            editBtn.classList.add('hidden');
        }
        if (permalinkBtn) {
            permalinkBtn.classList.remove('hidden');
            permalinkBtn.classList.add('flex');

            // Disable permalink button if there's no meaningful data to share
            const hasData = hasDataToShare();
            setButtonState(permalinkBtn, hasData);
        }
    }

    // Update field visibility based on read-only mode and field content
    setFieldVisibility(readOnly);
}

// Currency validation functions
function validateAndFormatCurrency(value) {
    if (!value) return '';

    let v = value.normalize('NFKC');

    // Strip everything except letters, marks, currency symbols, punctuation
    v = v.replace(/[^\p{L}\p{M}\p{Sc}\p{P}]+/gu, '');

    // Max 5 visible characters
    return [...v].slice(0, 5).join('');
}

// IBAN validation function
function validateAndFormatIBAN(value) {
    if (!value) return '';

    // Remove all whitespace and non-alphanumeric characters
    value = value.replace(/[^A-Za-z0-9]/g, '');

    // Limit to 34 characters and convert to uppercase
    return value.slice(0, 34).toUpperCase();
}

// SWIFT validation function
function validateAndFormatSWIFT(value) {
    if (!value) return '';

    // Remove all whitespace and non-alphanumeric characters
    value = value.replace(/[^A-Za-z0-9]/g, '');

    // Limit to 11 characters and convert to uppercase
    return value.slice(0, 11).toUpperCase();
}

// Add event listeners for the first row fields
const currencyField1 = document.getElementById('currency-1');
const ibanField1 = document.getElementById('iban-1');
const swiftField = document.getElementById('swift');

if (currencyField1) {
    currencyField1.addEventListener('input', (e) => {
        // Apply currency validation and formatting
        const formatted = validateAndFormatCurrency(e.target.value);
        e.target.value = formatted;
        setAllButtonStates();
    });
}

if (ibanField1) {
    ibanField1.addEventListener('input', (e) => {
        // Apply IBAN validation and formatting
        const formatted = validateAndFormatIBAN(e.target.value);
        e.target.value = formatted;
        setAllButtonStates();
    });
}

if (swiftField) {
    swiftField.addEventListener('input', (e) => {
        // Apply SWIFT validation and formatting
        const formatted = validateAndFormatSWIFT(e.target.value);
        e.target.value = formatted;
        setAllButtonStates();
    });
}

// Function to auto-resize a textarea based on its content
function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

// Auto-resize all textareas based on content
document.querySelectorAll("textarea").forEach(function(textarea) {
    autoResizeTextarea(textarea);
    textarea.style.overflowY = "hidden";

    textarea.addEventListener("input", function() {
        autoResizeTextarea(this);
    });
});

// Auto-resize all textareas when window is resized
window.addEventListener("resize", function() {
    document.querySelectorAll("textarea").forEach(function(textarea) {
        autoResizeTextarea(textarea);
    });
});

['swift', 'name', 'address', 'details'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('input', () => {
            setAllButtonStates();
        });
    }
});

// Function to add a new IBAN row
function addNewIBANRow() {
    const container = document.getElementById('iban-rows-container');
    const currentRowIndex = getNextRowIndex();

    const newRow = document.createElement('div');
    newRow.className = 'iban-row mt-4';
    newRow.setAttribute('data-row-index', currentRowIndex);

    newRow.innerHTML = `
        <div class="flex gap-2">
            <input type="text" id="currency-${currentRowIndex}" name="currency-${currentRowIndex}"
                class="w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark read-only:bg-gray-50 read-only:dark:bg-gray-800 read-only:text-gray-500 read-only:dark:text-gray-400 read-only:cursor-default read-only:focus:ring-0 text-center" aria-label="Currency (optional)" />
            <input type="text" id="iban-${currentRowIndex}" name="iban-${currentRowIndex}" value=""
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark read-only:bg-gray-50 read-only:dark:bg-gray-800 read-only:text-gray-500 read-only:dark:text-gray-400 read-only:cursor-default read-only:focus:ring-0" aria-label="IBAN" />
            <div class="flex gap-2">
                <button type="button" class="add-row-btn w-[42px] h-[42px] hidden items-center justify-center bg-green-200 hover:bg-green-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-dark text-lg transition-all duration-200 cursor-pointer" data-row-index="${currentRowIndex}" aria-label="Add new row">💱</button>
                <button type="button" class="delete-row-btn w-[42px] h-[42px] hidden items-center justify-center bg-red-200 hover:bg-red-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-dark text-lg transition-colors cursor-pointer" data-row-index="${currentRowIndex}" aria-label="Delete row">🗑️</button>
                <div class="relative">
                    <button type="button" class="copy-btn w-[42px] h-[42px] flex items-center justify-center bg-gray-200 dark:bg-gray-600 hover:not-disabled:bg-blue-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-dark text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" data-copytarget="iban-${currentRowIndex}" data-row-index="${currentRowIndex}" disabled>📋</button>
                    <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-700 dark:bg-gray-600 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 pointer-events-none data-visible:opacity-100 data-visible:pointer-events-auto z-50 mb-1" id="tooltip-iban-${currentRowIndex}">Copied!</div>
                </div>
            </div>
        </div>
    `;

    container.appendChild(newRow);

    // Enable tooltip transitions for the newly created tooltip
    const newTooltip = document.getElementById(`tooltip-iban-${currentRowIndex}`);
    if (newTooltip) {
        enableTooltipTransitions(newTooltip);
    }

    // Enable transitions for the newly created copy button
    const newCopyButton = document.querySelector(`.copy-btn[data-row-index="${currentRowIndex}"]`);
    if (newCopyButton) {
        enableCopyButtonTransitions(newCopyButton);
    }

    // Update all button states after adding the new row
    setAllButtonStates();

    // Add event listeners for the new fields
    const currencyField = document.getElementById(`currency-${currentRowIndex}`);
    const ibanField = document.getElementById(`iban-${currentRowIndex}`);

    currencyField.addEventListener('input', (e) => {
        // Apply currency validation and formatting
        const formatted = validateAndFormatCurrency(e.target.value);
        e.target.value = formatted;
        setAllButtonStates();
    });

    ibanField.addEventListener('input', (e) => {
        // Apply IBAN validation and formatting
        const formatted = validateAndFormatIBAN(e.target.value);
        e.target.value = formatted;
        setAllButtonStates();
    });
}



// Function to delete a row
function deleteRow(rowIndex) {
    if (rowIndex === 1) return; // Never delete the first row

    const row = document.querySelector(`.iban-row[data-row-index="${rowIndex}"]`);
    if (row) {
        // Simply remove the row from DOM
        row.remove();

    // Update all button states
    setAllButtonStates();
    }
}

// Event listener for "+" and delete buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-row-btn')) {
        const rowIndex = parseInt(e.target.getAttribute('data-row-index'));
        addNewIBANRow();
        // Update all button states
        setAllButtonStates();
    } else if (e.target.classList.contains('delete-row-btn')) {
        const rowIndex = parseInt(e.target.getAttribute('data-row-index'));
        deleteRow(rowIndex);
    }
});
function setFieldsFromParams() {
    const params = new URLSearchParams(window.location.search);

    // Handle legacy single IBAN parameter
    if (params.has('iban')) {
        document.getElementById('iban-1').value = params.get('iban') || '';
    }

    if (params.has('swift')) document.getElementById('swift').value = params.get('swift') || '';
    if (params.has('name')) document.getElementById('name').value = params.get('name') || '';
    if (params.has('address')) {
        document.getElementById('address').value = params.get('address') || '';
    }
    if (params.has('details')) document.getElementById('details').value = params.get('details') || '';

    // Handle currency field for row 1 (first row) - backwards compatibility with parameterless
    if (params.has('currency')) {
        document.getElementById('currency-1').value = params.get('currency') || '';
    }

    // Handle additional IBAN rows (starting from index 2)
    let rowIndex = 2;
    while (params.has(`currency-${rowIndex}`) || params.has(`iban-${rowIndex}`)) {
        // Create the row if it doesn't exist
        if (!document.getElementById(`iban-${rowIndex}`)) {
            addNewIBANRow();
        }

        if (params.has(`currency-${rowIndex}`)) {
            document.getElementById(`currency-${rowIndex}`).value = params.get(`currency-${rowIndex}`) || '';
        }
        if (params.has(`iban-${rowIndex}`)) {
            document.getElementById(`iban-${rowIndex}`).value = params.get(`iban-${rowIndex}`) || '';
        }
        rowIndex++;
    }

    // Update all button states after setting fields
    setAllButtonStates();

    // Auto-resize any textareas that have content from URL parameters
    document.querySelectorAll("textarea").forEach(function(textarea) {
        if (textarea.value) {
            autoResizeTextarea(textarea);
        }
    });
}

// Unified redirect function
function redirectToUrl(params, replace = false) {
    const url = params.toString()
        ? `${window.location.origin}${window.location.pathname}?${params.toString()}`
        : `${window.location.origin}${window.location.pathname}`;

    if (replace) {
        window.location.replace(url);
    } else {
        window.location.href = url;
    }
}

// Redirect from old parameter name to new one
function redirectFromOldParam() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('transaction') && !params.has('details')) {
        // Create new params with 'details' instead of 'transaction'
        const newParams = new URLSearchParams();

        // Copy all existing parameters
        for (const [key, value] of params.entries()) {
            if (key === 'transaction') {
                newParams.set('details', value);
            } else {
                newParams.set(key, value);
            }
        }

        // Redirect to the new URL
        redirectToUrl(newParams, true);
        return true; // Indicate that a redirect happened
    }
    return false; // No redirect needed
}

// Redirect if currency parameters need validation/formatting
function redirectFromInvalidCurrency() {
    const params = new URLSearchParams(window.location.search);
    let needsRedirect = false;
    const newParams = new URLSearchParams();

    // Copy all existing parameters, validating and formatting currency values
    for (const [key, value] of params.entries()) {
        if (key === 'currency' || key.startsWith('currency-')) {
            const formattedValue = validateAndFormatCurrency(value);
            if (value !== formattedValue) {
                needsRedirect = true;
            }
            if (formattedValue) {
                newParams.set(key, formattedValue);
            }
            // If formattedValue is empty, we don't add the parameter (effectively removing invalid ones)
        } else {
            newParams.set(key, value);
        }
    }

    if (needsRedirect) {
        // Redirect to the new URL with validated currency values
        redirectToUrl(newParams, true);
        return true; // Indicate that a redirect happened
    }
    return false; // No redirect needed
}

// Redirect if IBAN parameters need validation/formatting
function redirectFromInvalidIBAN() {
    const params = new URLSearchParams(window.location.search);
    let needsRedirect = false;
    const newParams = new URLSearchParams();

    // Copy all existing parameters, validating and formatting IBAN values
    for (const [key, value] of params.entries()) {
        if (key === 'iban' || key.startsWith('iban-')) {
            const formattedValue = validateAndFormatIBAN(value);
            if (value !== formattedValue) {
                needsRedirect = true;
            }
            if (formattedValue) {
                newParams.set(key, formattedValue);
            }
            // If formattedValue is empty, we don't add the parameter (effectively removing invalid ones)
        } else {
            newParams.set(key, value);
        }
    }

    if (needsRedirect) {
        // Redirect to the new URL with validated IBAN values
        redirectToUrl(newParams, true);
        return true; // Indicate that a redirect happened
    }
    return false; // No redirect needed
}

// Redirect if SWIFT parameters need validation/formatting
function redirectFromInvalidSWIFT() {
    const params = new URLSearchParams(window.location.search);
    let needsRedirect = false;
    const newParams = new URLSearchParams();

    // Copy all existing parameters, validating and formatting SWIFT values
    for (const [key, value] of params.entries()) {
        if (key === 'swift') {
            const formattedValue = validateAndFormatSWIFT(value);
            if (value !== formattedValue) {
                needsRedirect = true;
            }
            if (formattedValue) {
                newParams.set(key, formattedValue);
            }
            // If formattedValue is empty, we don't add the parameter (effectively removing invalid ones)
        } else {
            newParams.set(key, value);
        }
    }

    if (needsRedirect) {
        // Redirect to the new URL with validated SWIFT values
        redirectToUrl(newParams, true);
        return true; // Indicate that a redirect happened
    }
    return false; // No redirect needed
}

// Redirect if empty second row parameters are present
function redirectFromEmptySecondRows() {
    const params = new URLSearchParams(window.location.search);
    let needsRedirect = false;
    const newParams = new URLSearchParams();

    // Copy all existing parameters, excluding empty second row parameters
    for (const [key, value] of params.entries()) {
        // Check if this is a second row parameter (currency-N, iban-N where N >= 2)
        const match = key.match(/^(currency|iban)-(\d+)$/);
        if (match && parseInt(match[2]) >= 2) {
            // This is a second+ row parameter, only keep it if it has a non-empty value
            if (value.trim()) {
                newParams.set(key, value);
            } else {
                needsRedirect = true; // Found an empty second+ row parameter
            }
        } else {
            // Keep all other parameters as-is
            newParams.set(key, value);
        }
    }

    if (needsRedirect) {
        // Redirect to the new URL without empty second row parameters
        redirectToUrl(newParams, true);
        return true; // Indicate that a redirect happened
    }
    return false; // No redirect needed
}

// Initialize the page
(function() {
    // Check for redirects first
    if (redirectFromOldParam()) {
        // If redirect happened, don't continue with field population
        // The page will reload with the new URL
        return;
    }

    if (redirectFromInvalidCurrency()) {
        // If redirect happened, don't continue with field population
        // The page will reload with the new URL
        return;
    }

    if (redirectFromInvalidIBAN()) {
        // If redirect happened, don't continue with field population
        // The page will reload with the new URL
        return;
    }

    if (redirectFromInvalidSWIFT()) {
        // If redirect happened, don't continue with field population
        // The page will reload with the new URL
        return;
    }

    if (redirectFromEmptySecondRows()) {
        // If redirect happened, don't continue with field population
        // The page will reload with the new URL
        return;
    }

    setFieldsFromParams();

    // Apply read-only state if needed
    setFieldsReadOnly(isReadOnlyMode());
    
    // Apply field visibility based on read-only mode
    setFieldVisibility(isReadOnlyMode());

    // Update all button states after loading from params
    setAllButtonStates();
})();

// Permalink logic
function generatePermalinkParams() {
    const params = new URLSearchParams();
    const langVal = document.getElementById('lang-select').value;

    const swiftVal = document.getElementById('swift').value;
    const nameVal = document.getElementById('name').value;
    const addressVal = document.getElementById('address').value;
    const detailsVal = document.getElementById('details').value;

    if (langVal) params.set(QUERY_PARAM_LANG, langVal);
    if (swiftVal) params.set('swift', swiftVal);
    if (nameVal) params.set('name', nameVal);
    if (addressVal) params.set('address', addressVal);
    if (detailsVal) params.set('details', detailsVal);

    // Collect all existing rows data using their actual indices
    const allRows = document.querySelectorAll('.iban-row');

    allRows.forEach(row => {
        const rowIndex = parseInt(row.getAttribute('data-row-index'));
        const currencyField = document.getElementById(`currency-${rowIndex}`);
        const ibanField = document.getElementById(`iban-${rowIndex}`);

        if (currencyField && ibanField) {
            const currencyValue = currencyField.value.trim();
            const ibanValue = ibanField.value.trim();

            // For first row (index 1), use parameterless names for backwards compatibility
            if (rowIndex === 1) {
                if (currencyValue) {
                    params.set('currency', currencyValue);
                }
                if (ibanValue) {
                    params.set('iban', ibanValue);
                }
            } else {
                // For subsequent rows, use their actual index (2, 3, 4, ...)
                if (currencyValue) {
                    params.set(`currency-${rowIndex}`, currencyValue);
                }
                if (ibanValue) {
                    params.set(`iban-${rowIndex}`, ibanValue);
                }
            }
        }
    });

    return params;
}

function generatePermalinkUrl(params) {
    return params.toString()
        ? `${window.location.origin}${window.location.pathname}?${params.toString()}`
        : `${window.location.origin}${window.location.pathname}`;
}

function copyToClipboardWithFeedback(url, onSuccess) {
    navigator.clipboard.writeText(url).then(() => {
        // Show tooltip feedback
        showTooltip('tooltip-permalink');

        // Wait a moment for user to see the feedback, then execute callback
        setTimeout(onSuccess, 1000);
    }).catch(() => {
        // If clipboard fails, execute callback immediately
        onSuccess();
    });
}

function redirectToPermalink() {
    const params = generatePermalinkParams();
    const permalinkUrl = generatePermalinkUrl(params);

    copyToClipboardWithFeedback(permalinkUrl, () => {
        redirectToUrl(params);
    });
}
document.getElementById('permalink-btn').addEventListener('click', redirectToPermalink);

// Edit button functionality
document.getElementById('edit-btn').addEventListener('click', function() {
    const params = new URLSearchParams(window.location.search);
    params.set(QUERY_PARAM_EDIT, QUERY_PARAM_EDIT_VALUE);
    redirectToUrl(params);
});
document.getElementById('lang-select').addEventListener('change', function() {
    const currentParams = new URLSearchParams(window.location.search);
    const newLang = document.getElementById('lang-select').value;
    if (currentParams.get(QUERY_PARAM_LANG) !== newLang) {
        // Capture all current form field values to preserve user input
        const params = generatePermalinkParams();

        // Preserve edit state from URL if present, or add it if user has entered data AND we're not in read-only mode
        if (currentParams.has(QUERY_PARAM_EDIT)) {
            params.set(QUERY_PARAM_EDIT, currentParams.get(QUERY_PARAM_EDIT));
        } else if (hasDataToShare() && !isReadOnlyMode()) {
            // If user has entered data but not explicitly in edit mode, preserve edit mode
            params.set(QUERY_PARAM_EDIT, QUERY_PARAM_EDIT_VALUE);
        }

        // Update language parameter (generatePermalinkParams already includes current language, but we need to override it)
        params.set(QUERY_PARAM_LANG, newLang);
        redirectToUrl(params);
    }
});

// On page load, set language from query param if present
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has(QUERY_PARAM_LANG)) {
        const lang = params.get(QUERY_PARAM_LANG);
        const langSelect = document.getElementById('lang-select');
        if (langSelect && langSelect.value !== lang) {
            // Use the requested language if supported, otherwise default to the default language
            const supportedLang = TRANSLATIONS[lang] ? lang : DEFAULT_LANGUAGE;
            langSelect.value = supportedLang;
            setLanguage(lang);
        }
    }
})();

// Clear form and keep language when clicking the site name
document.getElementById('clear-form-btn').addEventListener('click', function() {
    const langVal = document.getElementById('lang-select').value;
    const t = getTranslations(langVal);
    const params = new URLSearchParams();
    if (langVal) params.set(QUERY_PARAM_LANG, langVal);
    announceA11y(t.formReset);
    redirectToUrl(params);
});

// Announce to screen readers
function announceA11y(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
        announcer.textContent = '';
        setTimeout(() => { announcer.textContent = message; }, 50);
    }
}

// Utility function to enable tooltip transitions
function enableTooltipTransitions(tooltip) {
    tooltip.classList.add('transition-all', 'duration-300');
}

function enableCopyButtonTransitions(copyButton) {
    copyButton.classList.add('transition-colors');
}

// Enable tooltip transitions after page load to prevent flash during initial render
window.addEventListener('load', function() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(enableTooltipTransitions);

    // Enable transition for language dropdown to prevent flash during initial render
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.classList.add('transition');
    }

    // Enable transitions for copy buttons and permalink button to prevent flash during initial render
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(enableCopyButtonTransitions);

    const permalinkButton = document.getElementById('permalink-btn');
    if (permalinkButton) {
        enableCopyButtonTransitions(permalinkButton);
    }
});
