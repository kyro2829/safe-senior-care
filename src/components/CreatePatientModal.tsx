import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Phone, Heart } from 'lucide-react';
import { z } from 'zod';

const patientSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  phone: z.string().trim().min(1, 'Phone number is required').max(20),
  emergencyContact: z.string().trim().min(1, 'Emergency contact is required').max(20),
});

interface CreatePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated?: () => void;
}

export function CreatePatientModal({ open, onOpenChange, onPatientCreated }: CreatePatientModalProps) {
  const { createPatientAccount } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    emergencyContact: ''
  });

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      emergencyContact: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validatedData = patientSchema.parse(formData);
      setIsSubmitting(true);
      
      const { error } = await createPatientAccount(
        validatedData.email,
        validatedData.password,
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          phone: validatedData.phone,
          emergency_contact: validatedData.emergencyContact,
          user_type: 'patient'
        }
      );
      
      if (!error) {
        resetForm();
        onOpenChange(false);
        onPatientCreated?.();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Create Patient Account
          </DialogTitle>
          <DialogDescription className="text-elderly">
            Add a new patient to your care network. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-firstName" className="text-elderly">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient-firstName"
                  type="text"
                  placeholder="First name"
                  className={`pl-10 elderly ${errors.firstName ? 'border-destructive' : ''}`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-lastName" className="text-elderly">Last Name</Label>
              <Input
                id="patient-lastName"
                type="text"
                placeholder="Last name"
                className={`elderly ${errors.lastName ? 'border-destructive' : ''}`}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-email" className="text-elderly">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient-email"
                type="email"
                placeholder="Patient's email address"
                className={`pl-10 elderly ${errors.email ? 'border-destructive' : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-phone" className="text-elderly">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient-phone"
                type="tel"
                placeholder="Patient's phone number"
                className={`pl-10 elderly ${errors.phone ? 'border-destructive' : ''}`}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-emergency" className="text-elderly">Emergency Contact</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient-emergency"
                type="tel"
                placeholder="Emergency contact number"
                className={`pl-10 elderly ${errors.emergencyContact ? 'border-destructive' : ''}`}
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                required
              />
            </div>
            {errors.emergencyContact && <p className="text-sm text-destructive">{errors.emergencyContact}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-password" className="text-elderly">Initial Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient-password"
                type="password"
                placeholder="Create strong password (8+ chars, A-Z, a-z, 0-9, !@#$)"
                className={`pl-10 elderly ${errors.password ? 'border-destructive' : ''}`}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            <p className="text-sm text-muted-foreground">
              The patient can change this password after their first login.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="elderly"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="elderly"
            >
              {isSubmitting ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}