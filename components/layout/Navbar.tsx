'use client';
import React, {useState} from 'react';
import {Image, LogOut, Settings, User} from 'lucide-react';
import TextField from "@/components/text-field";
import GradientButton from "@/components/gradeint-button";
import Modal from "@/components/modal";
import {useAuthActions} from "@/lib/hooks/useAuth";


export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const {logout} = useAuthActions();

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleSubmit = () => {
    console.log('First Name: ', firstName);
    console.log('Last Name: ', lastName);
    console.log('Email: ', email);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm">
      <div className="text-2xl font-bold text-teal-500">BRoom</div>
      <div className="flex items-center space-x-4">
        <button
          className="rounded-full p-2 hover:bg-gray-200 hover:text-teal-500 transition-all transform active:scale-95"
          onClick={() => setIsModalOpen(true)}
        >
          <Settings size={24} className="text-gray-600"/>
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
          <User size={20} className="text-gray-600"/>
        </div>
        <div
          className="cursor-pointer transform active:scale-95 transition-all hover:bg-gray-200 hover:text-teal-500"
          onClick={logout}
        >
          <LogOut className="text-gray-600"/>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex w-full items-center justify-between text-gray-800">
            <h2 className="flex-grow text-center text-2xl text-gray-800">
              Create workspace
            </h2>
          </div>
          <hr className="my-4"/>
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="mr-3 h-22 w-22 overflow-hidden rounded-full bg-gray-300">
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex cursor-pointer flex-row gap-2 text-gray-600">
              <Image/>
              <label htmlFor="file-upload" className="cursor-pointer">
                Edit image
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <TextField
              placeholder="First name"
              onChange={handleFirstNameChange}
            />
            <TextField
              placeholder="Last name"
              onChange={handleLastNameChange}
            />
            <TextField placeholder="Email name" onChange={handleEmailChange}/>
            <GradientButton text="Save" onClick={handleSubmit}/>
          </div>
        </Modal>
      </div>
    </nav>
  );
}
