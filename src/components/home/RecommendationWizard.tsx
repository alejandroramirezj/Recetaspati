import React, { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles, Users, CakeSlice, Heart, ThumbsUp, MessageCircle, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";

// Updated FormState for multi-select flavor
interface FormState {
  occasion: string;
  numberOfPeople: string;
  preference: string;
  flavor: string[]; // Changed to string array
}

// Define flavor options
const flavorOptions = [
  { id: 'chocolate_lover', label: 'Chocolate Lover 🍫' },
  { id: 'lotus', label: 'Lotus 🍪' },
  { id: 'pistacho', label: 'Pistacho 💚' },
  { id: 'fresa_nata', label: 'Fresa y Nata 🍓' },
  { id: 'queso', label: 'Queso 🧀' },
  { id: 'otro', label: 'Otro (indicar en mensaje)' }, // Added 'Otro' option
];

const RecommendationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formState, setFormState] = useState<FormState>({
    occasion: '',
    numberOfPeople: '',
    preference: '',
    flavor: [], // Initialize as empty array
  });

  const [open, setOpen] = useState(false);

  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Handler for single value fields (occasion, numberOfPeople)
  const handleSingleValueChange = (field: 'occasion' | 'numberOfPeople', value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Handler for RadioGroup (preference)
   const handleRadioChange = (value: string) => {
       setFormState(prev => ({ ...prev, preference: value }));
   }

   // Handler for Number Input
    const handlePeopleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSingleValueChange('numberOfPeople', event.target.value);
    }

   // Handler for Flavor Checkboxes
   const handleFlavorChange = (flavorId: string, checked: boolean | 'indeterminate') => {
       setFormState(prev => {
           const currentFlavors = prev.flavor;
           if (checked) {
               // Add flavor if checked and not already present
               return { ...prev, flavor: [...currentFlavors.filter(f => f !== flavorId), flavorId] }; 
           } else {
               // Remove flavor if unchecked
               return { ...prev, flavor: currentFlavors.filter(f => f !== flavorId) };
           }
       });
   }

  // Navegación
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Function to open WhatsApp (updated for flavor array)
  const openWhatsApp = () => {
      const { occasion, numberOfPeople, preference, flavor } = formState;
      
      const occasionText = occasion || 'Cualquiera';
      const peopleText = numberOfPeople || '-';
      const preferenceText = preference === 'surprise' ? '¡Sorpresa! 🎉' : (preference || 'Cualquiera');
      // Format flavor array or set default text
      const flavorText = flavor.length > 0 
          ? flavor.map(f => flavorOptions.find(opt => opt.id === f)?.label || f).join(', ') 
          : 'Sin preferencia';

      const message = 
`¡Hola Pati! 👋 Busco una recomendación:

*   🎉 Ocasión: ${occasionText}
*   🧑‍🤝‍🧑 Personas: ${peopleText}
*   🎂 Preferencia: ${preferenceText}
*   😋 ¿Qué me gusta más?: ${flavorText}

¡Gracias! 😊`;

      const phoneNumber = "34671266981";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  }

  // Renderizado condicional del contenido del paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="occasion" className="flex items-center gap-2 font-medium"><Heart size={18} /> Ocasión</Label>
            <Select onValueChange={(v) => handleSingleValueChange('occasion', v)} value={formState.occasion}>
              <SelectTrigger id="occasion"><SelectValue placeholder="Selecciona una ocasión..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="celebration">🥳 Una celebración</SelectItem>
                <SelectItem value="gift">🎁 Un regalo especial</SelectItem>
                <SelectItem value="myself">💖 Un capricho para mí</SelectItem>
                <SelectItem value="any">🤷‍♀️ Cualquiera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
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
        );
      case 3:
         return (
           <div className="space-y-2">
             <Label className="flex items-center gap-2 font-medium"><CakeSlice size={18}/> Tipo preferido</Label>
             <RadioGroup onValueChange={handleRadioChange} value={formState.preference} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><RadioGroupItem value="tartas" id="cat-tartas" className="peer sr-only" /><Label htmlFor="cat-tartas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Tartas 🎂</Label></div>
                <div><RadioGroupItem value="galletas" id="cat-galletas" className="peer sr-only" /><Label htmlFor="cat-galletas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Galletas 🍪</Label></div>
                <div><RadioGroupItem value="palmeritas" id="cat-palmeritas" className="peer sr-only" /><Label htmlFor="cat-palmeritas" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">Palmeritas 🥨</Label></div>
                <div><RadioGroupItem value="surprise" id="cat-surprise" className="peer sr-only" /><Label htmlFor="cat-surprise" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm">¡Sorpresa! 🎉</Label></div>
             </RadioGroup>
          </div>
         );
      case 4:
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium"><Smile size={18} /> ¿Qué te gusta más?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1"> 
              {flavorOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                          id={`flavor-${option.id}`}
                          checked={formState.flavor.includes(option.id)}
                          onCheckedChange={(checked) => handleFlavorChange(option.id, checked)}
                      />
                      <Label 
                          htmlFor={`flavor-${option.id}`}
                          className="text-sm font-normal cursor-pointer"
                      >
                          {option.label}
                      </Label>
                  </div>
              ))}
            </div>
          </div>
        );
      case 5: {
         // Mostrar un resumen antes de enviar
         const { occasion, numberOfPeople, preference, flavor } = formState;
         const occasionText = occasion || 'Cualquiera';
         const peopleText = numberOfPeople || '-';
         const preferenceText = preference === 'surprise' ? '¡Sorpresa! 🎉' : (preference || 'Cualquiera');
         const flavorText = flavor.length > 0 
             ? flavor.map(f => flavorOptions.find(opt => opt.id === f)?.label || f).join(', ') 
             : 'Sin preferencia';
         return (
             <div className="space-y-3 text-sm text-pati-dark-brown">
                 <p><span className="font-medium">Ocasión:</span> {occasionText}</p>
                 <p><span className="font-medium">Personas:</span> {peopleText}</p>
                 <p><span className="font-medium">Tipo:</span> {preferenceText}</p>
                 <p><span className="font-medium">Gustos:</span> {flavorText}</p>
                 <p className="pt-2 text-xs text-pati-brown">¿Todo correcto? Pulsa el botón para enviarnos tu consulta por WhatsApp.</p>
             </div>
         );
       }
      default:
        return null;
    }
  };

  // Ocultar el botón flotante si hay productos en el carrito
  if (totalItems > 0) return null;

  return (
    <>
      {/* Botón flotante minimizable */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 bg-pati-burgundy text-white px-4 py-2 rounded-full shadow-lg hover:bg-pati-brown transition-all text-base font-semibold"
              aria-label="Abrir recomendador"
            >
              <img src="/images/Bundcake.webp" alt="Tarta" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
              ¿No sabes qué elegir?
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full p-0 bg-transparent border-none shadow-none">
            <section className="bg-gradient-to-b from-pati-cream to-white rounded-2xl shadow-2xl border-2 border-pati-pink/50 overflow-hidden">
              <div className="px-4 pt-4 pb-2 text-center">
                <h2 className="text-xl font-bold text-pati-burgundy mb-1">¿No sabes qué elegir?</h2>
                <p className="text-sm text-pati-brown mb-2">¡Déjanos ayudarte a encontrar el capricho perfecto!</p>
              </div>
              <Card className="w-full shadow-none border-none bg-transparent">
                <CardHeader className="pb-2 pt-2 px-4">
                  <CardTitle className="text-base">Tu Capricho Ideal - Paso {currentStep} de {totalSteps}</CardTitle>
                  <Progress value={(currentStep / totalSteps) * 100} className="w-full h-1 mt-1 bg-gray-100 [&>div]:bg-pati-brown" />
                </CardHeader>
                <CardContent className="space-y-2 min-h-[120px] pt-2 pb-2 px-4">
                  {renderStepContent()}
                </CardContent>
                <CardFooter className="justify-between pt-2 pb-2 px-4 border-t-0">
                  <Button onClick={prevStep} variant="outline" disabled={currentStep === 1} className={`${currentStep === 1 ? 'invisible' : 'visible'} text-xs px-2 py-1`}><ChevronLeft className="mr-1 h-4 w-4"/> Anterior</Button>
                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep} className="text-xs px-2 py-1">Siguiente <ChevronRight className="ml-1 h-4 w-4"/></Button>
                  ) : (
                    <Button onClick={openWhatsApp} size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"><MessageCircle className="mr-2 h-4 w-4" /> ¡Pedir recomendación!</Button>
                  )}
                </CardFooter>
              </Card>
            </section>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default RecommendationWizard; 