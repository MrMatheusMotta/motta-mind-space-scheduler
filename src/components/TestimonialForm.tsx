
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TestimonialForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a avaliação e o comentário.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setHasSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "Depoimento enviado!",
      description: "Seu depoimento foi enviado para análise. Obrigada pelo feedback!",
    });
  };

  if (hasSubmitted) {
    return (
      <Card className="border-rose-nude-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-rose-nude-800 mb-2">
            Depoimento Enviado!
          </h3>
          <p className="text-rose-nude-600">
            Obrigada por compartilhar sua experiência. Seu depoimento está em análise e poderá aparecer no site em breve.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-rose-nude-200">
      <CardHeader>
        <CardTitle className="text-rose-nude-800">Deixe seu Depoimento</CardTitle>
        <CardDescription className="text-rose-nude-600">
          Compartilhe sua experiência com a terapia cognitiva comportamental e ajude outras pessoas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-rose-nude-700 font-medium">
              Avaliação *
            </Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-rose-nude-400 text-rose-nude-400"
                        : "text-rose-nude-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-rose-nude-700 font-medium">
              Seu Depoimento *
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência com a terapia..."
              className="mt-2 border-rose-nude-200 focus:border-rose-nude-400"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-rose-nude-700 font-medium">
              Foto (opcional)
            </Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-rose-nude-200 focus:border-rose-nude-400"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-rose-nude-200"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Depoimento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;
