import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('admin@drdo.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-line bg-panel p-8 shadow-xl">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <ShieldCheck size={24} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white tracking-tight">DPM-DSS</h1>
        <p className="mt-2 text-sm text-cyan-300 font-medium tracking-wide">AI-Powered Defence Project Monitoring</p>
        <p className="mt-2 text-xs text-muted leading-relaxed">"Intelligent Monitoring and Decision Support for Strategic Defence Projects"</p>
        
        <div className="mt-8">
          <label className="block text-xs font-medium text-slate-300 mb-2">Institutional Email</label>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            type="email" 
            className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        
        <div className="mt-5">
          <label className="block text-xs font-medium text-slate-300 mb-2">Secure Password</label>
          <input 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            type="password" 
            className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        
        {error && <p className="mt-4 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 p-3 rounded-lg">{error}</p>}
        
        <button 
          disabled={loading} 
          className="mt-8 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3 text-sm font-bold text-slate-950 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
        >
          {loading ? 'Authenticating…' : 'Secure Sign In'}
        </button>
        
        <div className="mt-6 border-t border-line pt-4 text-center">
           <p className="text-xs text-slate-500">Demo Credentials: admin@drdo.local / Admin@123</p>
        </div>
      </form>
    </main>
  );
}
