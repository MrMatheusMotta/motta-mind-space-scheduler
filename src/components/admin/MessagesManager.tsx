
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied' | 'archived';
}

const MessagesManager = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      subject: "Agendamento de Consulta",
      message: "Gostaria de agendar uma consulta para minha filha de 8 anos. Ela tem apresentado ansiedade na escola.",
      date: "2024-01-15",
      status: "new"
    },
    {
      id: "2", 
      name: "Ana Santos",
      email: "ana@email.com",
      subject: "Informações sobre Terapia",
      message: "Preciso de informações sobre terapia para ansiedade e depressão. Qual o valor das consultas?",
      date: "2024-01-14",
      status: "read"
    },
    {
      id: "3",
      name: "Juliana Costa",
      email: "juliana@email.com",
      phone: "(11) 88888-8888",
      subject: "Reagendamento",
      message: "Preciso reagendar minha consulta de terça-feira. Teria disponibilidade na quinta?",
      date: "2024-01-13",
      status: "replied"
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nova';
      case 'read': return 'Lida';
      case 'replied': return 'Respondida';
      case 'archived': return 'Arquivada';
      default: return status;
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.status === 'new' 
        ? { ...msg, status: 'read' } 
        : msg
    ));
  };

  const sendReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("Por favor, escreva uma resposta");
      return;
    }

    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, status: 'replied' } 
        : msg
    ));

    toast.success("Resposta enviada com sucesso!");
    setReplyText("");
    setSelectedMessage(null);
  };

  const archiveMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'archived' } 
        : msg
    ));
    toast.success("Mensagem arquivada");
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success("Mensagem excluída");
  };

  const filteredMessages = messages.filter(msg => 
    filterStatus === "all" || msg.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Mensagens</h2>
        <p className="text-rose-nude-600">Visualize e responda mensagens dos pacientes.</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          size="sm"
        >
          Todas
        </Button>
        <Button
          variant={filterStatus === "new" ? "default" : "outline"}
          onClick={() => setFilterStatus("new")}
          size="sm"
        >
          Novas
        </Button>
        <Button
          variant={filterStatus === "read" ? "default" : "outline"}
          onClick={() => setFilterStatus("read")}
          size="sm"
        >
          Lidas
        </Button>
        <Button
          variant={filterStatus === "replied" ? "default" : "outline"}
          onClick={() => setFilterStatus("replied")}
          size="sm"
        >
          Respondidas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-rose-nude-800">Lista de Mensagens</h3>
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`border-rose-nude-200 cursor-pointer transition-colors ${
                selectedMessage?.id === message.id 
                  ? 'bg-rose-nude-50 border-rose-nude-300' 
                  : 'hover:bg-rose-nude-25'
              }`}
              onClick={() => {
                setSelectedMessage(message);
                markAsRead(message.id);
              }}
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-rose-nude-800">{message.name}</h4>
                    <p className="text-sm text-rose-nude-600">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusText(message.status)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(message.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <h5 className="font-medium text-sm mb-1">{message.subject}</h5>
                <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          {selectedMessage ? (
            <Card className="border-rose-nude-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {selectedMessage.subject}
                    </CardTitle>
                    <CardDescription>
                      De: {selectedMessage.name} ({selectedMessage.email})
                      {selectedMessage.phone && ` - ${selectedMessage.phone}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => archiveMessage(selectedMessage.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{selectedMessage.message}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-nude-700">
                    Sua Resposta:
                  </label>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    rows={4}
                    className="border-rose-nude-200 focus:border-rose-nude-400"
                  />
                </div>

                <Button 
                  onClick={sendReply}
                  className="bg-rose-nude-500 hover:bg-rose-nude-600"
                  disabled={!replyText.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Resposta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-rose-nude-200">
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-rose-nude-300 mx-auto mb-4" />
                <p className="text-rose-nude-600">
                  Selecione uma mensagem para visualizar e responder
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
