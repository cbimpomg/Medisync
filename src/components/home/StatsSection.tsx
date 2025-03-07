
import { Users, Award } from 'lucide-react';

const StatsSection = () => {
  return (
    <div className="bg-medisync-primary py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-bold">4567</p>
              <p className="text-sm opacity-80">Happy Users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-bold">1</p>
              <p className="text-sm opacity-80">Years of Experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
