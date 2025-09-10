
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Rating } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type RateSellerDialogProps = {
  sellerName: string;
  onAddRating: (newRating: Omit<Rating, 'id' | 'customerId'>) => void;
};

export default function RateSellerDialog({ sellerName, onAddRating }: RateSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating > 0 && feedback && customerName) {
      onAddRating({ rating, feedback, customerName });
      toast({
        title: 'Rating Submitted!',
        description: `Your feedback for ${sellerName} has been recorded.`,
      });
      // Reset form and close dialog
      setRating(0);
      setFeedback('');
      setCustomerName('');
      setOpen(false);
    } else {
       toast({
        variant: 'destructive',
        title: 'Incomplete Form',
        description: 'Please provide a rating, feedback, and your name.',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="mr-2 h-4 w-4" />
          Rate Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate {sellerName}</DialogTitle>
          <DialogDescription>
            Share your experience to help other buyers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">
              Your Name
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rating</Label>
            <div className="col-span-3 flex items-center gap-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={starValue}
                    className={cn(
                      'h-6 w-6 cursor-pointer text-gray-300 transition-colors',
                      starValue <= (hoverRating || rating) && 'text-yellow-400 fill-yellow-400'
                    )}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="feedback" className="text-right pt-2">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="col-span-3"
              placeholder="Tell us about your experience..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
