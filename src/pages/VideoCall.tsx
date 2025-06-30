
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const VideoCall = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    toast.success("Chamada iniciada com sucesso!");
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    toast.info("Chamada encerrada");
    navigate("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Videochamada</h1>
            <p className="text-lg text-rose-nude-600">
              Bem-vindo(a), {user.full_name?.split(' ')[0] || 'Usuário'}! Sua consulta online está pronta para começar.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Área Principal da Videochamada */}
            <div className="lg:col-span-3">
              <Card className="border-rose-nude-200 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative bg-gray-900 rounded-t-lg aspect-video flex items-center justify-center">
                    {!isCallActive ? (
                      <div className="text-center text-white space-y-4">
                        <Video className="w-16 h-16 mx-auto opacity-50" />
                        <p className="text-lg">Pronto para iniciar a videochamada</p>
                        <Button 
                          onClick={handleStartCall}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Iniciar Chamada
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center space-y-4">
                          <div className="w-32 h-32 bg-rose-nude-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-3xl font-bold">
                              {user.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <p className="text-lg">{user.full_name || 'Usuário'}</p>
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            Em chamada • {formatDuration(callDuration)}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Controles da Videochamada */}
                    {isCallActive && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                        <Button
                          size="lg"
                          variant={isAudioOn ? "secondary" : "destructive"}
                          onClick={() => setIsAudioOn(!isAudioOn)}
                          className="rounded-full w-12 h-12 p-0"
                        >
                          {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </Button>
                        
                        <Button
                          size="lg"
                          variant={isVideoOn ? "secondary" : "destructive"}
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          className="rounded-full w-12 h-12 p-0"
                        >
                          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="destructive"
                          onClick={handleEndCall}
                          className="rounded-full w-12 h-12 p-0"
                        >
                          <Phone className="w-6 h-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Painel Lateral */}
            <div className="space-y-6">
              {/* Informações da Consulta */}
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 text-lg">Informações da Consulta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-rose-nude-600">Paciente:</span>
                    <span className="text-sm font-medium">{user.full_name || 'Usuário'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-rose-nude-600">Tipo:</span>
                    <span className="text-sm font-medium">Consulta Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-rose-nude-600">Status:</span>
                    <Badge variant={isCallActive ? "default" : "secondary"} className="text-xs">
                      {isCallActive ? "Em andamento" : "Aguardando"}
                    </Badge>
                  </div>
                  {isCallActive && (
                    <div className="flex justify-between">
                      <span className="text-sm text-rose-nude-600">Duração:</span>
                      <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Rápido */}
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 text-lg flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 border border-rose-nude-200 rounded p-3 text-sm overflow-y-auto">
                      <p className="text-rose-nude-600 text-center">
                        Nenhuma mensagem ainda
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 border border-rose-nude-200 rounded text-sm"
                        disabled={!isCallActive}
                      />
                      <Button size="sm" disabled={!isCallActive}>
                        Enviar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configurações Rápidas */}
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 text-lg flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configurações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rose-nude-600">Qualidade:</span>
                    <select className="text-xs border border-rose-nude-200 rounded px-2 py-1">
                      <option>HD</option>
                      <option>SD</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rose-nude-600">Áudio:</span>
                    <Badge variant={isAudioOn ? "default" : "secondary"} className="text-xs">
                      {isAudioOn ? "Ligado" : "Desligado"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-rose-nude-600">Vídeo:</span>
                    <Badge variant={isVideoOn ? "default" : "secondary"} className="text-xs">
                      {isVideoOn ? "Ligado" : "Desligado"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instruções */}
          {!isCallActive && (
            <Card className="border-rose-nude-200 mt-8">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Instruções para a Videochamada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <Video className="w-8 h-8 mx-auto text-rose-nude-600" />
                    <h3 className="font-medium text-rose-nude-800">1. Prepare seu ambiente</h3>
                    <p className="text-sm text-rose-nude-600">
                      Encontre um local silencioso e bem iluminado para a consulta
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Mic className="w-8 h-8 mx-auto text-rose-nude-600" />
                    <h3 className="font-medium text-rose-nude-800">2. Teste seu equipamento</h3>
                    <p className="text-sm text-rose-nude-600">
                      Verifique se sua câmera e microfone estão funcionando
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Users className="w-8 h-8 mx-auto text-rose-nude-600" />
                    <h3 className="font-medium text-rose-nude-800">3. Aguarde o terapeuta</h3>
                    <p className="text-sm text-rose-nude-600">
                      A Dra. Daiane entrará na chamada no horário agendado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
