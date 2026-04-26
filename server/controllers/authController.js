const supabase = require("../utils/supabaseClient");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("Register failed: Missing fields");
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      console.error("Supabase Register Error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please check your email for verification if required.",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name,
          createdAt: data.user.created_at,
        },
        token: data.session?.access_token,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name || data.user.email,
          createdAt: data.user.created_at,
        },
        token: data.session.access_token,
        redirectTo: "portal.html",
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
