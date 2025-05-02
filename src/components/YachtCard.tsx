
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

export interface YachtProps {
  id: string;
  name: string;
  type: string;
  length: number;
  capacity: number;
  pricePerDay: number;
  image: string;
}

const YachtCard = ({ id, name, type, length, capacity, pricePerDay, image }: YachtProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <Link to={`/yacht/${id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/yacht/${id}`}>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">{name}</h3>
        </Link>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{type}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{length} м</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">до {capacity} чел.</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-900 font-bold">
            {pricePerDay.toLocaleString()} ₽<span className="text-sm font-normal text-gray-600">/день</span>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YachtCard;
