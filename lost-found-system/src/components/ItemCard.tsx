import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, User, Edit, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface ItemCardProps {
  item: {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    status: 'lost' | 'found' | 'claimed' | 'returned';
    reportedBy: {
      _id: string;
      name: string;
      email: string;
    };
    claimedBy?: {
      _id: string;
      name: string;
      email: string;
    };
    reportedDate: string;
    foundDate?: string;
    claimedDate?: string;
    returnedDate?: string;
    contactInfo?: string;
  };
  currentUserId?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function ItemCard({ 
  item, 
  currentUserId, 
  onEdit, 
  onDelete, 
  showActions = true 
}: ItemCardProps) {
  const isOwner = currentUserId === item.reportedBy._id;
  const reportedDate = new Date(item.reportedDate);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header with status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.name}
            </h3>
            <StatusBadge status={item.status} />
          </div>
          {showActions && isOwner && (
            <div className="flex space-x-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(item._id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  title="Edit item"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-medium">
              {item.category}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              Reported {formatDistanceToNow(reportedDate, { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {item.status === 'lost' ? 'Lost by' : 'Found by'} {item.reportedBy.name}
            </span>
          </div>
          
          {item.claimedBy && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span>Claimed by {item.claimedBy.name}</span>
            </div>
          )}
        </div>

        {/* Contact info */}
        {item.contactInfo && (
          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Contact:</span> {item.contactInfo}
            </p>
          </div>
        )}

        {/* View details link */}
        <div className="flex justify-end">
          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}