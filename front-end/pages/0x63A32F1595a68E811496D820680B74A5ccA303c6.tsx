import Layout from "../components/common/layout";
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { PolarArea } from 'react-chartjs-2';
  
  ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

  

// GOAL 7: Affordable and Clean Energy

// GOAL 8: Decent Work and Economic Growth

// GOAL 9: Industry, Innovation and Infrastructure

// GOAL 10: Reduced Inequality

// GOAL 11: Sustainable Cities and Communities

// GOAL 12: Responsible Consumption and Production

// GOAL 13: Climate Action

// GOAL 14: Life Below Water

// GOAL 15: Life on Land

// GOAL 16: Peace and Justice Strong Institutions

// GOAL 17: Partnerships to achieve the Goal
// colors: https://www.un.org/development/desa/disabilities/envision2030.html

  export const data = {
    labels: ["1. No Poverty", "2. Zero Hunger", "3. Good Health and Well-being", "4. Quality Education", "5. Gender Equality", "6. Clean Water and Sanitation"],
    datasets: [
      {
        label: '# of Votes',
        data: [3, 4, 3, 7, 8, 5],
        backgroundColor: [
          '#E43F42',
          '#E7B446',
          '#65A146',
          '#C93931',
          '#E94F34',
          '#64C3E4',
        ],
        borderWidth: 1,
      },
    ],
  };
//   export const data = {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [
//       {
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.5)',
//           'rgba(54, 162, 235, 0.5)',
//           'rgba(255, 206, 86, 0.5)',
//           'rgba(75, 192, 192, 0.5)',
//           'rgba(153, 102, 255, 0.5)',
//           'rgba(255, 159, 64, 0.5)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };
  

export default function About() {
  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-6 prose prose-teal prose-lg text-gray-500 mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-gray-900">
                J△MΞS.eth
            </h2>
            <h3>Sustainable development goals</h3>
            <PolarArea data={data} />
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
