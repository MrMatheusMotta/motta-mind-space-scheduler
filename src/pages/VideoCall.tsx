
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Users, Settings, MessageCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

const VideoCall = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [hasScheduledCall, setHasScheduledCall] = useState(true); // Mock: user has a scheduled call

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleJoinCall = () => {
    setIsCallActive(true);
    toast.success("Conectado à videochamada!");
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    toast.info("Videochamada encerrada");
  };

  const scheduledCall = {
    date: "2024-03-25",
    time: "19:00",
    service: "Acompanhamento Quinzenal",
    therapist: "Daiane Motta"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Videochamada</h1>
            <p className="text-lg text-rose-nude-600">
              Ambiente seguro para seu atendimento online
            </p>
          </div>

          {!hasScheduledCall ? (
            <Card className="border-rose-nude-200 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-rose-nude-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-rose-nude-800 mb-4">
                  Nenhuma sessão agendada
                </h3>
                <p className="text-rose-nude-600 mb-6">
                  Você precisa ter uma consulta agendada para acessar a videochamada.
                </p>
                <Button 
                  asChild 
                  className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                >
                  <a href="/booking">Agendar Consulta</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Scheduled Call Info */}
              <Card className="border-rose-nude-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Próxima Sessão Agendada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-rose-nude-600">Data</p>
                      <p className="font-semibold text-rose-nude-800">
                        {new Date(scheduledCall.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-rose-nude-600">Horário</p>
                      <p className="font-semibold text-rose-nude-800">{scheduledCall.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-rose-nude-600">Serviço</p>
                      <p className="font-semibold text-rose-nude-800">{scheduledCall.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-rose-nude-600">Terapeuta</p>
                      <p className="font-semibold text-rose-nude-800">{scheduledCall.therapist}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Video Area */}
                <div className="lg:col-span-2">
                  <Card className="border-rose-nude-200">
                    <CardContent className="p-0">
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        {isCallActive ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-32 h-32 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-white font-bold text-4xl">DM</span>
                              </div>
                              <p className="text-white text-lg">Daiane Motta</p>
                              <Badge className="bg-green-600 text-white mt-2">Online</Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-rose-nude-100 to-rose-nude-200 flex items-center justify-center">
                            <div className="text-center">
                              <Video className="w-16 h-16 text-rose-nude-400 mx-auto mb-4" />
                              <p className="text-rose-nude-700 text-lg mb-4">Videochamada não iniciada</p>
                              <Button 
                                onClick={handleJoinCall}
                                className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Entrar na Chamada
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* User Video (small overlay) */}
                        {isCallActive && (
                          <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white flex items-center justify-center">
                            {isVideoOn ? (
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-1 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <p className="text-white text-xs">{user.name.split(' ')[0]}</p>
                              </div>
                            ) : (
                              <VideoOff className="w-8 h-8 text-white" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      {isCallActive && (
                        <div className="p-4 bg-gray-100 flex justify-center space-x-4">
                          <Button
                            variant={isMuted ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant={!isVideoOn ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                          >
                            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleEndCall}
                          >
                            <PhoneOff className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                  {/* Session Info */}
                  <Card className="border-rose-nude-200">
                    <CardHeader>
                      <CardTitle className="text-rose-nude-800 text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Informações da Sessão
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Status:</span>
                        <Badge className={isCallActive ? "bg-green-600" : "bg-gray-500"}>
                          {isCallActive ? "Ativa" : "Aguardando"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Duração:</span>
                        <span className="text-rose-nude-800">50 minutos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Modalidade:</span>
                        <span className="text-rose-nude-800">Online</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical Support */}
                  <Card className="border-rose-nude-200">
                    <CardHeader>
                      <CardTitle className="text-rose-nude-800 text-lg flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Suporte Técnico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-rose-nude-700">
                        <p className="mb-2">Problemas com conexão?</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Verifique sua internet</li>
                          <li>• Permita acesso à câmera/microfone</li>
                          <li>• Atualize seu navegador</li>
                          <li>• Use Chrome ou Firefox</li>
                        </ul>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-rose-nude-700 border-rose-nude-300"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contatar Suporte
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Notes */}
                  <Card className="border-rose-nude-200">
                    <CardHeader>
                      <CardTitle className="text-rose-nude-800 text-lg">Lembrete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-rose-nude-700 space-y-2">
                        <p>• Encontre um local tranquilo</p>
                        <p>• Use fones de ouvido se possível</p>
                        <p>• Tenha água por perto</p>
                        <p>• Prepare suas questões</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
