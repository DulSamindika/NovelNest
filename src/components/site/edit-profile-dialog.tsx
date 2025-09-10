
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
import { Edit, Upload } from 'lucide-react';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type EditProfileDialogProps = {
  user: User;
  onProfileUpdate: (updatedUser: Partial<User>) => void;
};

export default function EditProfileDialog({ user, onProfileUpdate }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [profilePicUrl, setProfilePicUrl] = useState(user.profilePicUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    onProfileUpdate({
      username,
      mobileNumber,
      profilePicUrl,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={profilePicUrl} alt={user.username} />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button asChild variant="outline">
                <label htmlFor="profile-pic-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                    <Input id="profile-pic-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobileNumber" className="text-right">
              Phone
            </Label>
            <Input
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
