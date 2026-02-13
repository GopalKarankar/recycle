import { AlignJustify } from 'lucide-react';
import UsersTable from './TableSort';
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import { UserRound } from 'lucide-react';
import { ClipboardCheck } from 'lucide-react';
import { Trophy } from 'lucide-react';
import { BarChart } from 'lucide-react';
import { Recycle } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';

const Dashboard = () => {

    const location = useLocation();
    const loc = location.pathname.split("/")[1];

    const [locPath, setLocPath] = useState("");

    useEffect(() => {
        setLocPath(loc);
    }, [loc]);


    // console.log(location.pathname.split("/")[1]);

    return (
        <div className=' flex flex-col w-screen h-screen'>

            {/* Top */}
            <div className='h-3/20 bg-green-500 text-center flex flex-row justify-center items-center text-4xl px-8'>

                {/* Logo */}
                <div className=' flex justify-center items-center text-white font-bold gap-2'> 
                       <Recycle size={36} /> Recycling  System dashboard
                 </div>

                {/* Hamburger button */}
                {/* <AlignJustify className=" bg-green-500 rounded-2xl p-1 border-2  border-white text-white hover:text-green-500 hover:bg-white hover:border-green-500 hover:border-2 transition-colors duration-200" size={34} /> */}
                
            </div>

            {/* Middle */}
            <div className='h-17/20 flex flex-row '>
                
                {/* Sidebar */}
                <div className=' flex flex-col justify-center w-3/20 h-auto bg-green-500  '>
                
                    <NavLink className="relative" to="Profiles"  
                    style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                    })}>
                    
                        {locPath === "Profiles" && (<span className=" absolute w-[4px] h-[56px] bg-white rounded-tr-4xl rounded-br-4xl "></span>)}

                        <div className='flex flex-row justify-around text-center text-white py-4 hover:text-green-500 hover:bg-white transition-colors duration-200'>
                            <UserRound/> Candidates
                        </div>
                        
                    </NavLink> 
                    
                    <NavLink className="relative" to="Evaluations"  style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                    
                        {locPath === "Evaluations" && (<span className=" absolute w-[4px] h-[56px] bg-white rounded-tr-4xl rounded-br-4xl "></span>)}

                    <div className='flex flex-row justify-around  text-center text-white py-4 hover:text-green-500 hover:bg-white transition-colors duration-200 wrap-break-word'>
                              <ClipboardCheck/> Skill heatmap
                    </div>
                    </NavLink>
                    

                    <NavLink className="relative"  to="Rankings"  style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                    
                        {locPath === "Rankings" && (<span className=" absolute w-[4px] h-[56px] bg-white rounded-tr-4xl rounded-br-4xl "></span>)}

                        <div className='flex flex-row justify-around  text-center text-white py-4 hover:text-green-500 hover:bg-white transition-colors duration-200'>
                               <BarChart  /> Rankings
                        </div>
                    </NavLink>

                    
                    <NavLink className="relative"  to="Leaderboard"  style={({ isActive }) => ({
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "blue" : "black",
                    })}>
                    
                        {locPath === "Leaderboard" && (<span className=" absolute w-[4px] h-[56px] bg-white rounded-tr-4xl rounded-br-4xl "></span>)}

                        <div className='flex flex-row justify-around  font text-center text-white py-4 hover:text-green-500 hover:bg-white transition-colors duration-200'>
                               <Trophy/> Leaderboard
                        </div>
                    </NavLink>

                </div>

                {/* Section */}
                <div className="w-17/20 bg-green-500 overflow-auto  ">
                    <div className=" rounded-[20px] bg-white overflow-auto" >
                        <Outlet/>
                    </div>
                </div>

            </div>

            {/* Bottom */}
            {/* <div className='h-1/20 text-center bg-green-500 text-white'>bottom</div> */}

        </div>
    );
}

export default Dashboard;
