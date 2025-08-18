import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const DebugAuth = () => {
  const { user, session } = useAuth();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-sm">Debug Auth</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>User Email:</strong> {user?.email || 'Not logged in'}
        </div>
        <div>
          <strong>User Role:</strong> {user?.role || 'No role'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'No ID'}
        </div>
        <div>
          <strong>Session exists:</strong> {session ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Is Admin:</strong> {user?.email === 'psicologadaianesilva@outlook.com' ? 'Yes' : 'No'}
        </div>
        <Button 
          onClick={() => console.log('User object:', user, 'Session:', session)}
          size="sm"
          className="w-full"
        >
          Log to Console
        </Button>
      </CardContent>
    </Card>
  );
};

export default DebugAuth;