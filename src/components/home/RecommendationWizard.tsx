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
import { productsData, Product } from '@/data/products';
import { Sparkles, Users, CakeSlice, Heart, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define state structure with numberOfPeople
interface FormState {
  occasion: string;
  numberOfPeople: string;
  preference: string;
  flavor: string;
}

const RecommendationWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    occasion: '',
    numberOfPeople: '',
    preference: '',
    flavor: '',
  });
  const [recommendation, setRecommendation] = useState<Product[] | null>(null);

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
    const goToNextStepFromFlavor = () => {
         if (step === 4) {
             getRecommendations();
         }
    }

  const getRecommendations = () => {
    let filtered = [...productsData];
    const peopleCount = parseInt(formState.numberOfPeople) || 0;

    // Filter by preference
    if (formState.preference && formState.preference !== 'surprise') {
      filtered = filtered.filter(p => p.category === formState.preference);
    }

    // --- Enhanced Filtering Logic --- 

    // 1. Number of People:
    if (peopleCount > 8) {
        // Prioritize Tartas or large packs of Palmeritas/Mini-Tartas
        filtered = filtered.filter(p => 
            p.category === 'tartas' || 
            (p.category === 'palmeritas' && p.options?.some(o => o.name.includes('50'))) ||
            (p.category === 'mini-tartas')
        );
    } else if (peopleCount <= 2 && formState.occasion !== 'celebration') {
        // Prioritize Galletas or small Palmeritas packs if not a celebration
        filtered = filtered.filter(p => 
             p.category === 'galletas' || 
             (p.category === 'palmeritas' && p.options?.some(o => o.name.includes('25'))) ||
             p.category === 'tartas' // Keep tartas as an option
        );
    }

    // 2. Occasion (applied after people filtering)
     if (formState.occasion === 'celebration' && peopleCount > 0) { // Ensure people count > 0
        filtered.sort((a, b) => (b.category === 'tartas' ? 1 : -1)); // Prioritize tartas heavily
    } else if (formState.occasion === 'gift') {
        filtered.sort((a, b) => { // Prefer Galletas slightly, then Tartas
            const scoreA = a.category === 'galletas' ? 10 : a.category === 'tartas' ? 8 : 0;
            const scoreB = b.category === 'galletas' ? 10 : b.category === 'tartas' ? 8 : 0;
            return scoreB - scoreA;
        });
    }

    // 3. Flavor (simple keyword matching - needs improvement w/ tags)
    const flavor = formState.flavor;
    if (flavor && flavor !== 'todos') {
        filtered = filtered.filter(p => {
            const nameDesc = `${p.name.toLowerCase()} ${p.description.toLowerCase()}`;
            if (flavor === 'chocolate_lover') return nameDesc.includes('chocolate') || nameDesc.includes('nutella') || nameDesc.includes('oreo') || nameDesc.includes('kinder');
            if (flavor === 'lotus') return nameDesc.includes('lotus');
            if (flavor === 'pistacho') return nameDesc.includes('pistacho');
            if (flavor === 'fresa_nata') return nameDesc.includes('fresa') || nameDesc.includes('nata') || nameDesc.includes('frutos rojos'); // Expand keywords
            if (flavor === 'queso') return nameDesc.includes('queso');
            return true; // Should not happen if flavor is selected
        });
    }

    // If filtered list is empty after specific flavor, try again without flavor filter
    if (filtered.length === 0 && formState.flavor !== 'todos' && formState.flavor !== '') {
        // Reset flavor filtering and try again (optional, provides fallback)
        let fallbackFiltered = [...productsData];
         if (formState.preference && formState.preference !== 'surprise') {
             fallbackFiltered = fallbackFiltered.filter(p => p.category === formState.preference);
         }
         // Re-apply people/occasion logic if needed on fallback
         // ... (add people/occasion filtering again if desired for fallback)
        setRecommendation(fallbackFiltered.slice(0, 2)); 
    } else {
        setRecommendation(filtered.slice(0, 2));
    }

    setStep(5); // Move to new results step (was 4)
  };

  const resetForm = () => {
      setFormState({ occasion: '', numberOfPeople: '', preference: '', flavor: '' });
      setRecommendation(null);
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
               <Button onClick={goToNextStepFromFlavor} className="w-full mt-4 bg-pati-burgundy hover:bg-pati-brown">
                 <Sparkles className="mr-2 h-4 w-4" /> ¡Encontrar mi dulce!
               </Button>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-gray-500">
                <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Atrás</Button>
                <span>Paso 4 de 4</span>
             </CardFooter>
          </>
        );
       case 5:
            return (
            <>
                <CardHeader>
                <CardTitle className="text-center text-2xl">¡Aquí tienes tu recomendación!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {recommendation && recommendation.length > 0 ? (
                    recommendation.map(rec => (
                    <div key={rec.id} className="flex flex-col sm:flex-row items-center gap-4 border border-pati-burgundy p-4 rounded-lg bg-pati-light-pink/50 shadow-sm">
                        <img src={rec.image} alt={rec.name} className="w-24 h-24 object-contain rounded-md bg-white flex-shrink-0" />
                        <div className="flex-grow text-center sm:text-left">
                        <h4 className="font-semibold text-lg text-pati-burgundy mb-1">{rec.name}</h4>
                        <p className="text-sm text-pati-brown mb-2">{rec.description.split('.')[0]}.</p> 
                        <Button size="sm" variant="outline" onClick={() => navigate(`/product/${rec.category}/${rec.id}`)} className="mt-2 sm:mt-0">
                            Ver Detalles
                        </Button>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-pati-brown py-4">No hemos encontrado una recomendación exacta, ¡pero seguro que algo te encanta!</p>
                )}
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="ghost" onClick={resetForm}>Empezar de nuevo</Button>
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
            <img src="/lovable-uploads/Bundcake.JPG" alt="Tarta deliciosa" className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"/>
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