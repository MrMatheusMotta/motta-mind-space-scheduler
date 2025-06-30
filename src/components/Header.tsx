
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-rose-nude-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-lg">DM</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold gradient-text">Daiane Motta</h1>
            <p className="text-xs text-rose-nude-600">TCC • CRP-RJ 52221</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
            Início
          </Link>
          <Link to="/about" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
            Sobre Mim
          </Link>
          {user && (
            <>
              <Link to="/booking" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
                Agendar
              </Link>
              <Link to="/videocall" className="text-rose-nude-700 hover:text-rose-nude-900 transition-colors">
                Videochamada
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-rose-nude-700">
                Olá, {user.full_name?.split(' ')[0] || 'Usuário'}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-rose-nude-700" />
          ) : (
            <Menu className="w-6 h-6 text-rose-nude-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-rose-nude-200">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/about" 
              className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre Mim
            </Link>
            {user && (
              <>
                <Link 
                  to="/booking" 
                  className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Agendar
                </Link>
                <Link 
                  to="/videocall" 
                  className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Videochamada
                </Link>
                <Link 
                  to="/profile" 
                  className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link 
                      to="/admin" 
                      className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Administrar
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="block text-rose-nude-700 hover:text-rose-nude-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
            
            <div className="pt-4 border-t border-rose-nude-200">
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm text-rose-nude-700">
                    Olá, {user.full_name?.split(' ')[0] || 'Usuário'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/register">Cadastrar</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
