import { Share2 } from "lucide-react";

function ShareBtn({id, fullname, job, experience, gender}) {

        // console.log(window.location.href.replace("/Profiles", ""))

  const handleShare = async () => {

    if (navigator.share) {

      await navigator.share({
        title: 'Candidate Profile',
        text: 'Check this candidate.',
        url: window.location.href.replace("/Profiles", "")+"/ProfileView?"+`id=${id}&fullName=${fullname}&job=${job}&experience=${experience}&gender=${gender}`,
      });
      
    } else {

      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');

    }
  };

//   return <button onClick={handleShare}>Share</button>;
    return <Share2 onClick={handleShare} className="text-green-700 hover:bg-green-700 hover:text-white hover:cursor-pointer hover:rounded-sm" />;

}

export default ShareBtn;
