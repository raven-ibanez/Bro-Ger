import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src="https://amyfewmjpfplarkrevut.supabase.co/storage/v1/object/public/menu-images/1761372138519-5ciub5jsntb.jpg"
          alt="WAFFLE NATION & BRO-GER Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
};

export default Hero;