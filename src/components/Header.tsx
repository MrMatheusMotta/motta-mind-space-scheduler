
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BarChart3 } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-rose-nude-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">DM</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Daiane Motta</h1>
            <p className="text-xs text-rose-nude-600">TCC • CRP-RJ 52221</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
            Início
          </Link>
          {user && (
            <>
              <Link to="/booking" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
                Agendar
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
                    Administrar
                  </Link>
                  <Link to="/dashboard" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-rose-nude-700 hidden md:block">
                Olá, {user.name.split(' ')[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile')}
                className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
