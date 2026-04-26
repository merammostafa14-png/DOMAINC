import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://agrlqnknhahhzupzqkvc.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_kt83A10h9AmjcofhW4ysBQ_jtN7xWqy"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const AUTH_STORAGE_KEY = "domainc-auth";

const fallbackPlans = {
  hosting: [
    {
      name: "Starter",
      price: "EGP 250",
      suffix: "/mo",
      description: "Reliable entry infrastructure for focused deployment teams.",
      features: ["1 website", "10GB NVMe storage", "Standard support"],
      cta: "Select Plan",
      link: "signup.html",
    },
    {
      name: "Professional",
      price: "EGP 700",
      suffix: "/mo",
      description: "Balanced compute, support, and domain ownership for scaling teams.",
      features: ["Unlimited websites", "100GB NVMe storage", "Priority 24/7 support", "Free domain included"],
      cta: "Start Free Trial",
      link: "signup.html",
      featured: true,
    },
    {
      name: "Business",
      price: "EGP 1400",
      suffix: "/mo",
      description: "High-touch infrastructure for enterprise operations.",
      features: ["Unmetered resources", "Dedicated IP address", "Daily backups"],
      cta: "Talk to Sales",
      link: "contact.html",
    },
  ],
  vps: [
    {
      name: "Starter VPS",
      price: "EGP 420",
      suffix: "/mo",
      description: "Lean compute for early SaaS and staging environments.",
      features: ["2 vCPU cores", "4GB RAM", "80GB NVMe storage", "1 snapshot included"],
      cta: "Select VPS",
      link: "signup.html",
    },
    {
      name: "Scale VPS",
      price: "EGP 860",
      suffix: "/mo",
      description: "Balanced VPS configuration for growing SaaS applications.",
      features: ["4 vCPU cores", "8GB RAM", "160GB NVMe storage", "Daily snapshots"],
      cta: "Launch Now",
      link: "signup.html",
      featured: true,
    },
    {
      name: "Growth VPS",
      price: "EGP 1540",
      suffix: "/mo",
      description: "High-room compute with premium support and scaling headroom.",
      features: ["8 vCPU cores", "16GB RAM", "320GB NVMe storage", "Priority support"],
      cta: "Talk to an Architect",
      link: "contact.html",
    },
  ],
};

const fallbackDomainServices = [
  {
    title: "Domain Registration",
    description: "Secure premium TLDs with transparent pricing and quick provisioning.",
    highlight: ".com from $9.99",
  },
  {
    title: "Transfers",
    description: "Move domains to DOMAINC with guided migration and DNS continuity.",
    highlight: "Free DNS migration",
  },
  {
    title: "Managed DNS",
    description: "Low-latency DNS zones with records, failover, and team access controls.",
    highlight: "Global Anycast",
  },
  {
    title: "Protection",
    description: "WHOIS privacy, lock controls, and renewal reminders for critical domains.",
    highlight: "Renewal safeguards",
  },
];

const chatRules = [
  {
    keywords: ["vps", "server", "compute"],
    response: "For growing SaaS or app workloads, the balanced VPS or Professional hosting tiers are the best starting point.",
  },
  {
    keywords: ["domain", "dns", "transfer", "tld"],
    response: "We can help with registration, transfers, managed DNS, and privacy protection. Try the domain search to check availability.",
  },
  {
    keywords: ["price", "plan", "pricing", "cost"],
    response: "We offer Starter, Professional, and Business hosting, plus VPS and dedicated options depending on how much control and scale you need.",
  },
  {
    keywords: ["support", "contact", "sales", "help"],
    response: "Use the contact form for project-specific help, or tell me whether you need sales, migration, billing, or technical support.",
  },
  {
    keywords: ["backup", "restore", "snapshot"],
    response: "Backups and snapshots are available across the platform, with daily automation on higher plans and VPS tiers.",
  },
  {
    keywords: ["migration", "move", "transfer site"],
    response: "DOMAINC offers guided migration support to help move workloads, domains, and data with minimal disruption.",
  },
];


function setButtonState(button, label, disabled) {
  if (!button) {
    return;
  }

  button.textContent = label;
  button.disabled = disabled;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] || character;
  });
}

function initNavigation() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!navToggle || !nav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

function renderPlans(root, plans) {
  root.innerHTML = plans
    .map(
      (plan) => `
        <article class="pricing-card reveal ${plan.featured ? "featured" : ""}">
          <span class="badge">${escapeHtml(plan.name)}</span>
          <div class="price">
            <strong>${escapeHtml(plan.price)}</strong>
            <span>${escapeHtml(plan.suffix || "")}</span>
          </div>
          <p>${escapeHtml(plan.description)}</p>
          <ul class="plan-features">
            ${plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}
          </ul>
          <a class="${plan.featured ? "btn" : "btn-secondary"}" href="${escapeHtml(plan.link || "signup.html")}">
            ${escapeHtml(plan.cta || "View Plan")}
          </a>
        </article>
      `
    )
    .join("");

  root.querySelectorAll(".reveal").forEach((card) => card.classList.add("visible"));
}

async function initPlanLists() {
  const roots = document.querySelectorAll("[data-plan-list]");

  if (!roots.length) {
    return;
  }

  roots.forEach((root) => {
    const category = root.dataset.planList || "hosting";
    const plans = fallbackPlans[category] || fallbackPlans.hosting;
    renderPlans(root, plans);
  });
}

function renderDomainServices(root, services) {
  root.innerHTML = services
    .map(
      (service) => `
        <article class="feature-card reveal service-card">
          <span class="eyebrow">${escapeHtml(service.title)}</span>
          <h3>${escapeHtml(service.highlight || service.title)}</h3>
          <p>${escapeHtml(service.description)}</p>
        </article>
      `
    )
    .join("");

  root.querySelectorAll(".reveal").forEach((card) => card.classList.add("visible"));
}

async function initDomainServices() {
  const roots = document.querySelectorAll("[data-domain-services]");

  if (!roots.length) {
    return;
  }

  roots.forEach((root) => renderDomainServices(root, fallbackDomainServices));
}

function showDomainResult(container, result) {
  if (!container) {
    return;
  }

  container.hidden = false;
  container.className = `result-banner ${result.available ? "success" : "warning"}`;
  container.innerHTML = `
    <strong>${escapeHtml(result.domain)}</strong>
    <span>${escapeHtml(result.message)}</span>
    ${
      result.suggestions?.length
        ? `<div class="result-suggestions">${result.suggestions
            .map((suggestion) => `<span>${escapeHtml(suggestion)}</span>`)
            .join("")}</div>`
        : ""
    }
  `;
}

function initDomainForms() {
  const forms = document.querySelectorAll("[data-domain-form]");

  forms.forEach((form) => {
    const input = form.querySelector("[data-domain-input]");
    const button = form.querySelector("button");
    const result = form.parentElement?.querySelector("[data-domain-result]") || form.querySelector("[data-domain-result]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const query = input?.value.trim() || "domainc.com";

      setButtonState(button, "Checking...", true);

      // Simulation of domain search for frontend-only mode
      setTimeout(() => {
        const pseudoAvailable = query.length % 2 === 0;
        showDomainResult(result, {
          domain: query,
          available: pseudoAvailable,
          message: pseudoAvailable
            ? "Looks available. Start registration from the domains page."
            : "That domain may already be taken. Try one of the suggestions below.",
          suggestions: [`secure-${query}`, `${query.split(".")[0] || "domainc"}.net`, `${query.split(".")[0] || "domainc"}.tech`],
        });
        setButtonState(button, "Search", false);
      }, 600);
    });
  });
}

function setFeedback(feedback, type, text) {
  if (!feedback) {
    return;
  }

  feedback.hidden = false;
  feedback.className = `form-feedback ${type}`;
  feedback.textContent = text;
}

function initContactForms() {
  const forms = document.querySelectorAll("[data-contact-form]");

  forms.forEach((form) => {
    const button = form.querySelector("button[type='submit']");
    const feedback = form.querySelector("[data-contact-feedback]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      setButtonState(button, "Sending...", true);

      try {
        // Direct Supabase insertion
        const { error } = await supabase.from('contacts').insert([payload]);

        if (error) throw error;

        form.reset();
        setFeedback(feedback, "success", "Your request has been submitted successfully.");
      } catch (error) {
        console.error("Contact Error:", error);
        setFeedback(feedback, "warning", "Unable to send message directly to database. Please try again later.");
      } finally {
        setButtonState(button, "Send Request", false);
      }
    });
  });
}

function storeAuthSession(data) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

function getAuthSession() {
  const session = localStorage.getItem(AUTH_STORAGE_KEY);
  return session ? JSON.parse(session) : null;
}

function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = "login.html";
}

function initAuthForms() {
  const loginForm = document.querySelector("[data-login-form]");
  const signupForm = document.querySelector("[data-signup-form]");

  if (loginForm) {
    const button = loginForm.querySelector("button[type='submit']");
    const feedback = loginForm.querySelector("[data-login-feedback]");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const { email, password } = Object.fromEntries(formData.entries());

      setButtonState(button, "Authenticating...", true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Map Supabase response to the format expected by the app
        const sessionData = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email
          },
          token: data.session.access_token
        };

        storeAuthSession(sessionData);
        setFeedback(feedback, "success", "Login successful. Redirecting...");
        window.setTimeout(() => {
          window.location.href = "portal.html";
        }, 500);
      } catch (error) {
        console.error("Auth Error:", error);
        setFeedback(feedback, "warning", error.message || "Login failed. Please check your credentials.");
      } finally {
        setButtonState(button, "Login", false);
      }
    });
  }

  if (signupForm) {
    const button = signupForm.querySelector("button[type='submit']");
    const feedback = signupForm.querySelector("[data-signup-feedback]");

    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      const { name, email, password } = Object.fromEntries(formData.entries());

      setButtonState(button, "Creating...", true);

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });

        if (error) throw error;

        const sessionData = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || name
          },
          token: data.session?.access_token
        };

        if (!data.session) {
          setFeedback(feedback, "success", "Account created! Please check your email for a verification link.");
        } else {
          storeAuthSession(sessionData);
          setFeedback(feedback, "success", "Account created successfully. Redirecting...");
          window.setTimeout(() => {
            window.location.href = "portal.html";
          }, 500);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        setFeedback(feedback, "warning", error.message || "Account creation failed.");
      } finally {
        setButtonState(button, "Create Account", false);
      }
    });
  }
}

function initProtectedPage() {
  const isProtected = window.location.pathname.includes("portal.html") || 
                      window.location.pathname.includes("infrastructure.html") ||
                      window.location.pathname.includes("containers.html") ||
                      window.location.pathname.includes("storage.html");

  const session = getAuthSession();

  // Handle Auth UI toggles
  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  const signupLinks = document.querySelectorAll('a[href="signup.html"]');
  const navActions = document.querySelector(".nav-actions");

  if (session) {
    loginLinks.forEach(link => link.style.display = "none");
    // Optionally hide signup links if they are in the navbar
    signupLinks.forEach(link => {
      if (link.closest('.nav-actions') || link.closest('.site-header')) {
        link.style.display = "none";
      }
    });

    if (navActions && !navActions.querySelector("[data-logout-nav]")) {
      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.className = "btn-secondary";
      logoutBtn.textContent = "Logout";
      logoutBtn.dataset.logoutNav = "true";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
      navActions.prepend(logoutBtn);
    }
  } else {
    loginLinks.forEach(link => link.style.display = "");
    signupLinks.forEach(link => link.style.display = "");
    const logoutBtn = document.querySelector("[data-logout-nav]");
    if (logoutBtn) logoutBtn.remove();
  }

  if (isProtected && !session) {
    window.location.href = "login.html";
    return;
  }

  if (session) {
    const portalHeader = document.querySelector(".portal-header");
    if (portalHeader) {
      const nameEl = portalHeader.querySelector("h1");
      const emailEl = portalHeader.querySelector(".eyebrow");
      const actionArea = portalHeader.querySelector(".hero-actions");

      if (nameEl) nameEl.textContent = `Welcome, ${session.user?.name || "Operator"}`;
      if (emailEl) emailEl.textContent = session.user?.email || "Authenticated";
      
      if (actionArea && !document.querySelector("[data-logout-button]")) {
        const logoutBtn = document.createElement("a");
        logoutBtn.className = "btn-secondary";
        logoutBtn.href = "#";
        logoutBtn.textContent = "Logout";
        logoutBtn.dataset.logoutButton = "true";
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          logout();
        });
        actionArea.prepend(logoutBtn);
      }
    }

    // Fallback for other pages
    const userNameElements = document.querySelectorAll("[data-user-name]");
    const userEmailElements = document.querySelectorAll("[data-user-email]");
    userNameElements.forEach(el => el.textContent = session.user?.name || "User");
    userEmailElements.forEach(el => el.textContent = session.user?.email || "");

    // If on login/signup page while logged in, redirect to portal
    if (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html")) {
      window.location.href = "portal.html";
    }
  }
}

function getChatReply(message) {
  const normalized = message.toLowerCase();
  const matched = chatRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));

  if (matched) {
    return matched.response;
  }

  return "I can help with hosting plans, VPS sizing, domain services, support, backups, and migration. Tell me which area you need.";
}

function appendChatMessage(thread, role, text) {
  if (!thread) {
    return;
  }

  const message = document.createElement("div");
  message.className = `chat-mini ${role}`;
  message.textContent = text;
  thread.appendChild(message);
  thread.scrollTop = thread.scrollHeight;
}

function initChatWidgets() {
  const widgets = document.querySelectorAll("[data-chat-widget]");

  widgets.forEach((widget) => {
    const thread = widget.querySelector("[data-chat-thread]");
    const form = widget.querySelector("[data-chat-form]");
    const input = widget.querySelector("[data-chat-input]");
    const suggestions = widget.querySelectorAll("[data-chat-suggestion]");
    const header = widget.querySelector(".chat-widget-header");
    const welcomeMessage = thread?.querySelector(".chat-mini.bot")?.textContent || "Welcome to DOMAINC. Ask me about hosting, domains, or support.";
    let hasAutoMinimized = false;

    const setMinimized = (minimized) => {
      widget.classList.toggle("minimized", minimized);
    };

    const submitMessage = (message) => {
      const trimmed = message.trim();

      if (!trimmed) {
        return;
      }

      setMinimized(false);
      appendChatMessage(thread, "user", trimmed);
      appendChatMessage(thread, "bot", getChatReply(trimmed));
    };

    if (thread && !thread.children.length) {
      appendChatMessage(thread, "bot", welcomeMessage);
    }

    const autoMinimize = () => {
      if (hasAutoMinimized) {
        return;
      }

      hasAutoMinimized = true;
      setMinimized(true);
    };

    window.setTimeout(autoMinimize, 4500);
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 24) {
          autoMinimize();
        }
      },
      { passive: true, once: true }
    );

    suggestions.forEach((button) => {
      button.addEventListener("click", () => {
        submitMessage(button.dataset.chatSuggestion || button.textContent || "");
      });
    });

    if (header) {
      header.addEventListener("click", () => {
        setMinimized(!widget.classList.contains("minimized"));
      });
    }

    if (form && input) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitMessage(input.value);
        input.value = "";
        input.focus();
      });
    }
  });
}

initNavigation();
initReveal();
initPlanLists();
initDomainServices();
initDomainForms();
initContactForms();
initAuthForms();
initProtectedPage();
initChatWidgets();
