import {Users} from 'lucide-react';

type WorkspaceCardProps = {
  workspace_id: number;
  name: string;
  description: string;
  members_count: string;
  user_detail:string;
  onClick: (id: number) => void;
};

export default function WorkspaceCard
({workspace_id, name, description, members_count,user_detail, onClick}: WorkspaceCardProps) {
  return (
    <div
      className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg cursor-pointer h-60 transform active:scale-95 flex flex-col"
      onClick={() => onClick(workspace_id)} // ใช้ workspace_id ในการเรียกใช้งาน onClick
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-sm text-gray-500">By: {user_detail}</span>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </button>
      </div>

      {/* Description ที่ขยายได้ */}
      <p className="mb-4 text-gray-600 flex-grow">{description}</p>

      {/* จำนวนสมาชิกอยู่ล่างสุดของ Card */}
      <div className="flex items-center justify-end mt-auto">
        <Users size={24} className="text-gray-600"/>
        <span className="text-right ml-2 text-black">{members_count} members</span>
      </div>
    </div>
  );


};

