import React, { useState, JSX } from "react";
import api from "../utils/api";

// 1. Define props interface
interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

// 2. Define the expected API response
interface RegisterResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }): JSX.Element => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Type the change event for input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Type the form submission event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the generic to type the Axios response
      const { data } = await api.post<RegisterResponse>("/api/v1/users", { user: formData });
      
      localStorage.setItem("token", data.token);
      onRegisterSuccess();
    } catch (err: any) {
      // Handle Rails validation array or generic error string
      const messages = err.response?.data?.errors;
      setError(Array.isArray(messages) ? messages.join(", ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 mt-2">Join us to start organizing your day</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            name="password_confirmation"
            type="password"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Repeat password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 flex justify-center items-center disabled:bg-blue-300 disabled:shadow-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Account...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-bold transition-colors underline-offset-4 hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
