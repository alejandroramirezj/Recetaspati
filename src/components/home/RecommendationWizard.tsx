import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles, Users, CakeSlice, Heart, ThumbsUp, MessageCircle } from 'lucide-react';

// Define state structure with numberOfPeople
interface FormState {
  occasion: string;
  numberOfPeople: string;
  preference: string;
  flavor: string;
}

const RecommendationWizard = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    occasion: '',
    numberOfPeople: '',
    preference: '',
    flavor: '',
  });

  // Combined handler for Select and Input
  const handleValueChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Auto-advance if it's a Select/Radio in steps 1, 3 (old 2)
    if ((field === 'occasion' && step === 1) || (field === 'preference' && step === 3)) {
         if (step < 4) { setStep(step + 1); }
    }
  };

  // Handler for RadioGroup (Preference)
   const handleRadioChange = (value: string) => {
       handleValueChange('preference', value);
   }

   // Handler for Number Input - Go to next step on Enter or Blur?
   // Let's keep it simple: require button click or focus change
    const handlePeopleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange('numberOfPeople', event.target.value);
    }

    // Handler to explicitly move to next step from Number of People input
    const goToNextStepFromPeople = () => {
        if (step === 2 && step < 4) {
            setStep(step + 1);
        }
    }

    // --- MODIFIED: Function to open WhatsApp --- 
    const openWhatsApp = () => {
        const { occasion, numberOfPeople, preference, flavor } = formState;
        
        // Sanitize and format values for the message
        const occasionText = occasion || 'Cualquiera';
        const peopleText = numberOfPeople || '-';
        const preferenceText = preference === 'surprise' ? 'Sorpresa' : (preference || 'Cualquiera');
        const flavorText = flavor === 'todos' ? 'Sin preferencia' : (flavor || 'Sin preferencia');

        const message = 
`¡Hola Pati! 👋 Me gustaría una recomendación de dulce con estas características:

*   Ocasión: ${occasionText}
*   Número de personas: ${peopleText}
*   Tipo preferido: ${preferenceText}
*   Sabor preferido: ${flavorText}

¡Gracias! 😊`;

        const phoneNumber = "34671266981"; // Remove '+'
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp link in a new tab
        window.open(whatsappUrl, '_blank');
    }

  const resetForm = () => {
      setFormState({ occasion: '', numberOfPeople: '', preference: '', flavor: '' });
      setStep(1);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Heart size={20} /> ¿Para qué ocasión?</CardTitle>
              <CardDescription>Cuéntanos un poco más.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(v) => handleValueChange('occasion', v)} value={formState.occasion}>
                <SelectTrigger><SelectValue placeholder="Selecciona una ocasión..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="celebration">Una celebración</SelectItem>
                  <SelectItem value="gift">Un regalo especial</SelectItem>
                  <SelectItem value="myself">Un capricho para mí</SelectItem>
                  <SelectItem value="any">Cualquiera</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
             <CardFooter className="text-xs text-gray-500 justify-end">Paso 1 de 4</CardFooter>
          </>
        );
      case 2:
        return (
            <>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users size={20}/> ¿Para cuántas personas?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Label htmlFor="num-people">Número aproximado</Label>
                   <Input 
                      id="num-people"
                      type="number" 
                      placeholder="Ej: 8" 
                      value={formState.numberOfPeople}
                      onChange={handlePeopleInputChange}
                      min="1"
                    />
                    <Button onClick={goToNextStepFromPeople} className="w-full mt-4" disabled={!formState.numberOfPeople}>
                       Siguiente
                    </Button>
                </CardContent>
                 <CardFooter className="flex justify-between text-xs text-gray-500">
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Atrás</Button>
                    <span>Paso 2 de 4</span>
                </CardFooter>
            </>
        );
       case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CakeSlice size={20}/> ¿Qué tipo de dulce prefieres?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={handleRadioChange} value={formState.preference} className="grid grid-cols-2 gap-4">
                 <div><RadioGroupItem value="tartas" id="cat-tartas" className="peer sr-only" /><Label htmlFor="cat-tartas" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">Tartas</Label></div>
                 <div><RadioGroupItem value="galletas" id="cat-galletas" className="peer sr-only" /><Label htmlFor="cat-galletas" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">Galletas</Label></div>
                 <div><RadioGroupItem value="palmeritas" id="cat-palmeritas" className="peer sr-only" /><Label htmlFor="cat-palmeritas" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">Palmeritas</Label></div>
                 <div><RadioGroupItem value="surprise" id="cat-surprise" className="peer sr-only" /><Label htmlFor="cat-surprise" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">¡Sorpréndeme!</Label></div>
               </RadioGroup>
            </CardContent>
             <CardFooter className="flex justify-between text-xs text-gray-500">
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Atrás</Button>
                <span>Paso 3 de 4</span>
             </CardFooter>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ThumbsUp size={20}/> ¿Alguna preferencia de sabor?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(v) => handleValueChange('flavor', v)} value={formState.flavor}>
                <SelectTrigger><SelectValue placeholder="Elige un sabor o déjalo vacío..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chocolate_lover">Chocolate Lover 🍫</SelectItem>
                  <SelectItem value="lotus">Lotus</SelectItem>
                  <SelectItem value="pistacho">Pistacho</SelectItem>
                  <SelectItem value="fresa_nata">Fresa y Nata 🍓</SelectItem>
                  <SelectItem value="queso">Queso</SelectItem>
                  <SelectItem value="todos">Todos / Sin preferencia</SelectItem>
                </SelectContent>
              </Select>
               <Button onClick={openWhatsApp} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                 <MessageCircle className="mr-2 h-4 w-4" /> ¡Pedir recomendación por WhatsApp!
               </Button>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-gray-500">
                <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Atrás</Button>
                <span>Paso 4 de 4</span>
             </CardFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section id="recomendador" className="py-16 bg-gradient-to-b from-pati-cream to-white">
      <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10 flex flex-col md:flex-row items-center justify-center gap-6">
            <img src="/Recetaspati/videos/Bundcake.JPG" alt="Tarta deliciosa" className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"/>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-3">
                ¿No sabes qué elegir?
                </h2>
                <p className="text-lg text-pati-brown max-w-md mx-auto">
                ¡Déjanos ayudarte a encontrar el capricho perfecto con unas pocas preguntas!
                </p>
            </div>
          </div>

          <Card className="w-full shadow-xl transition-all duration-300 ease-out border-2 border-pati-pink/50">
             {renderStep()}
           </Card>
      </div>
    </section>
  );
};

export default RecommendationWizard; 