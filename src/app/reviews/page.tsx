export default function ReviewsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-blue-900 tracking-tight">
        Customer Reviews
      </h1>
      <p className="text-lg text-center text-gray-700 mb-12">
        Bus2Ride prides itself on happy customers. Here are real reviews from our riders!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 max-w-4xl mx-auto">
        {/* Review cards - copy from homepage, or ideally refactor to a component for DRY */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating. Gail in the office is top notch and on top of everything! The price was very good. The driver was so nice and professional. The limo looked pristine, inside and out. Use them, you wont regret it!! Used for my son's wedding on August 11.”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Paul P.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “The limo company that you need to call when u have an event. Prices and limos and party bus are like no other limo company.”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Jessie A.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “Definitely lives up to their name! We used them for our bachelorette/bachelor parties and our wedding and will be using them again. They were absolutely great! Even let me extend an hour when I decided my bachelorette party was too much fun and I wasn't ready to go yet!! :) I would absolutely recommend them and do to everyone!!”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Dee C.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Halee H.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “We had the best time ever!! Darrius was our driver and he was so fun and amazing!! It was for our bachelor/bachelorette weekend and he made it so much fun!!! I would recommend them 100%!!!”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Rachel L.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “Sonny can take your event to the next level with his beautiful limos and sedans making you feel like a movie star! Highly recommend his service!”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Becky B.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “Top of the line chauffer and limo service.”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— George S.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
          <p className="text-gray-700 italic mb-4 text-lg">
            “What a memorable night for our students at Faith Christian School prom. Rick was an excellent and safe driver, providing top notch customer service, and was prompt with timing. The owner was great to work with and has the best prices and customer service. We will definitely choose them for next year's prom. Amazing experience!”
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700">— Teresa S.</span>
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
