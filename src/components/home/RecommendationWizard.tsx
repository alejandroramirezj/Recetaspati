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
  // Remove step state
  // const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    occasion: '',
    numberOfPeople: '',
    preference: '',
    flavor: '',
  });

  // Handler for Select and Input
  const handleValueChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Remove auto-advance logic
  };

  // Handler for RadioGroup (Preference)
   const handleRadioChange = (value: string) => {
       handleValueChange('preference', value);
   }

   // Handler for Number Input
    const handlePeopleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleValueChange('numberOfPeople', event.target.value);
    }

  // Remove step advancement handlers
  // const goToNextStepFromPeople = () => { ... }

  // Function to open WhatsApp
  const openWhatsApp = () => {
      const { occasion, numberOfPeople, preference, flavor } = formState;
      
      const occasionText = occasion || 'Cualquiera';
      const peopleText = numberOfPeople || '-';
      const preferenceText = preference === 'surprise' ? '¡Sorpresa! 🎉' : (preference || 'Cualquiera');
      const flavorText = flavor === 'todos' ? 'Sin preferencia' : (flavor || 'Sin preferencia');

      const message = 
`¡Hola Pati! 👋 Busco una recomendación:

*   🎉 Ocasión: ${occasionText}
*   🧑‍🤝‍🧑 Personas: ${peopleText}
*   🎂 Preferencia: ${preferenceText}
*   🍓 Sabor: ${flavorText}

¡Gracias! 😊`;

      const phoneNumber = "34671266981";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  }

  // Remove resetForm or keep if a reset button is desired
  // const resetForm = () => { ... }

  // Remove renderStep function
  // const renderStep = () => { ... }

  return (
    <section id="recomendador" className="py-16 bg-gradient-to-b from-pati-cream to-white">
      <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10 flex flex-col md:flex-row items-center justify-center gap-6">
            <img src="/Recetaspati/images/Bundcake.JPG" alt="Tarta deliciosa" className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"/>
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
             <CardHeader>
               <CardTitle>Cuéntanos tus preferencias</CardTitle>
               <CardDescription>Rellena los detalles y te ayudamos por WhatsApp.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                
                {/* Occasion */}
                <div className="space-y-2">
                    <Label htmlFor="occasion" className="flex items-center gap-2 font-medium"><Heart size={18} /> Ocasión</Label>
                    <Select onValueChange={(v) => handleValueChange('occasion', v)} value={formState.occasion}>
                        <SelectTrigger id="occasion"><SelectValue placeholder="Selecciona una ocasión..." /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="celebration">🥳 Una celebración</SelectItem>
                        <SelectItem value="gift">🎁 Un regalo especial</SelectItem>
                        <SelectItem value="myself">💖 Un capricho para mí</SelectItem>
                        <SelectItem value="any">🤷‍♀️ Cualquiera</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Number of People */}
                <div className="space-y-2">
                    <Label htmlFor="num-people" className="flex items-center gap-2 font-medium"><Users size={18}/> Personas (aprox.)</Label>
                    <Input 
                        id="num-people"
                        type="number" 
                        placeholder="Ej: 8" 
                        value={formState.numberOfPeople}
                        onChange={handlePeopleInputChange}
                        min="1"
                        className="w-full md:w-1/2"
                        />
                </div>

                {/* Preference */}
                <div className="space-y-2">
                     <Label className="flex items-center gap-2 font-medium"><CakeSlice size={18}/> Tipo preferido</Label>
                     <RadioGroup onValueChange={handleRadioChange} value={formState.preference} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         <div><RadioGroupItem value="tartas" id="cat-tartas" className="peer sr-only" /><Label htmlFor="cat-tartas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Tartas 🎂</Label></div>
                         <div><RadioGroupItem value="galletas" id="cat-galletas" className="peer sr-only" /><Label htmlFor="cat-galletas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Galletas 🍪</Label></div>
                         <div><RadioGroupItem value="palmeritas" id="cat-palmeritas" className="peer sr-only" /><Label htmlFor="cat-palmeritas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Palmeritas 🥨</Label></div>
                         <div><RadioGroupItem value="surprise" id="cat-surprise" className="peer sr-only" /><Label htmlFor="cat-surprise" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">¡Sorpresa! 🎉</Label></div>
                     </RadioGroup>
                </div>

                 {/* Flavor */}
                <div className="space-y-2">
                    <Label htmlFor="flavor" className="flex items-center gap-2 font-medium"><ThumbsUp size={18}/> Sabor</Label>
                    <Select onValueChange={(v) => handleValueChange('flavor', v)} value={formState.flavor}>
                        <SelectTrigger id="flavor"><SelectValue placeholder="Elige un sabor o déjalo vacío..." /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="chocolate_lover">Chocolate Lover 🍫</SelectItem>
                        <SelectItem value="lotus">Lotus 🍪</SelectItem>
                        <SelectItem value="pistacho">Pistacho 💚</SelectItem>
                        <SelectItem value="fresa_nata">Fresa y Nata 🍓</SelectItem>
                        <SelectItem value="queso">Queso 🧀</SelectItem>
                        <SelectItem value="todos">Todos / Sin preferencia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

             </CardContent>
             <CardFooter className="justify-center pt-4">
                 <Button onClick={openWhatsApp} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-base">
                    <MessageCircle className="mr-2 h-5 w-5" /> ¡Pedir recomendación por WhatsApp!
                 </Button>
             </CardFooter>
           </Card>
      </div>
    </section>
  );
};

export default RecommendationWizard; 