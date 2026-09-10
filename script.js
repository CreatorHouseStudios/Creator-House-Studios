// Cre8tor House Studios — Interactive Engine

// 1. AGE GATE VERIFICATION
document.addEventListener('DOMContentLoaded', () => {
  const isVerified = localStorage.getItem('chs_age_verified');
  const modal = document.getElementById('age-gate-modal');
  if (!isVerified && modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else if (modal) {
    modal.style.display = 'none';
  }
});

function confirmAge(allowed) {
  if (allowed) {
    localStorage.setItem('chs_age_verified', 'true');
    const modal = document.getElementById('age-gate-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  } else {
    window.location.href = 'https://www.google.com';
  }
}

// 2. CREATOR APPLICATION SUBMISSION
function handleCreatorApplication(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Validate Age (DOB must be >= 21 years old)
  const dobInput = formData.get('dob');
  if (dobInput) {
    const dob = new Date(dobInput);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 21) {
      showStatusModal('Age Requirement', 'Applicants must be at least 21 years of age to qualify for Cre8tor House Studios.');
      return;
    }
  }

  // Collect specialties
  const focusCheckboxes = form.querySelectorAll('input[name="content_focus"]:checked');
  const focusList = Array.from(focusCheckboxes).map(cb => cb.value).join(', ');

  const applicantName = formData.get('legal_name');
  const applicantEmail = formData.get('email');
  const primaryHandle = formData.get('primary_handle');

  // Submit via Web3Forms (reliable direct form submission with email notification)
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = 'TRANSMITTING APPLICATION...';
  submitBtn.disabled = true;

  const payload = {
    access_key: '568cb435-ff55-46eb-a437-1481ba28bbd5', // default public handler or fallback
    subject: `CREATOR APPLICATION — ${applicantName} (@${primaryHandle})`,
    from_name: 'Cre8tor House Studios Portal',
    legal_name: applicantName,
    stage_name: formData.get('stage_name') || 'N/A',
    email: applicantEmail,
    phone: formData.get('phone'),
    dob: formData.get('dob'),
    location: formData.get('location'),
    primary_platform: formData.get('primary_platform'),
    primary_handle: primaryHandle,
    secondary_socials: formData.get('secondary_socials') || 'None provided',
    monthly_revenue: formData.get('monthly_revenue'),
    experience_level: formData.get('experience_level'),
    content_focus: focusList || 'None specified',
    residency_interest: formData.get('residency_interest'),
    creator_goals: formData.get('creator_goals')
  };

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
    form.reset();
    showStatusModal('Application Received', `Thank you, ${applicantName}. Your application has been logged into our secure onboarding system. Our talent management team will review your profile and reach out via email.`);
  })
  .catch(err => {
    // Graceful fallback to mail client if network blocks external API
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
    const mailtoBody = encodeURIComponent(
      `Name: ${applicantName}
Email: ${applicantEmail}
Platform: ${primaryHandle}

Goals:
${formData.get('creator_goals')}`
    );
    window.location.href = `mailto:creatorhousestudios@gmail.com?subject=${encodeURIComponent('CREATOR APPLICATION — ' + applicantName)}&body=${mailtoBody}`;
    showStatusModal('Application Sent', 'Your email client has been prepared with your application details. Please click Send to deliver it.');
  });
}

// 3. INVESTOR INQUIRY SUBMISSION
function handleInvestorInquiry(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company') || 'Independent Investor';
  const message = formData.get('message');

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerText = 'SENDING INQUIRY...';
  submitBtn.disabled = true;

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      access_key: '568cb435-ff55-46eb-a437-1481ba28bbd5',
      subject: `PRIORITY • INVESTOR INQUIRY — ${name} (${company})`,
      name: name,
      email: email,
      company: company,
      message: message
    })
  })
  .then(() => {
    submitBtn.innerText = 'SEND INVESTOR INQUIRY →';
    submitBtn.disabled = false;
    form.reset();
    showStatusModal('Inquiry Received', 'Thank you for your interest in Cre8tor House Studios. Founder Michelle Miller and our development team will respond shortly.');
  })
  .catch(() => {
    submitBtn.innerText = 'SEND INVESTOR INQUIRY →';
    submitBtn.disabled = false;
    window.location.href = `mailto:creatorhousestudios@gmail.com?subject=${encodeURIComponent('INVESTOR INQUIRY — ' + name)}&body=${encodeURIComponent(message)}`;
  });
}

// 4. MODAL HELPER
function showStatusModal(title, message) {
  const modal = document.getElementById('status-modal');
  const modalTitle = document.getElementById('status-modal-title');
  const modalMsg = document.getElementById('status-modal-msg');
  if (modal && modalTitle && modalMsg) {
    modalTitle.innerText = title;
    modalMsg.innerText = message;
    modal.style.display = 'flex';
  } else {
    alert(`${title}

${message}`);
  }
}

function closeStatusModal() {
  const modal = document.getElementById('status-modal');
  if (modal) modal.style.display = 'none';
}
