import { lastSendsData } from '@/lib/types';
import React from 'react';
import { Separator } from '../ui/separator';

export const LastSends = ({
  id,
  workType,
  location,
  value,
  name
}: lastSendsData) => {


  return (
      <ul>
          <li key={id} className="border-gray-200 py-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-semibold">{name}</p>
                <p className="text-sm text-gray-500">
                  {workType} {location && <span>({location})</span>}
                </p>
              </div>
                <div className="text-right">
                  <p className="text-base font-semibold">{value}</p>
                </div>
            </div>
                <Separator className='my-2'/>
          </li>
      </ul>
  );
};
