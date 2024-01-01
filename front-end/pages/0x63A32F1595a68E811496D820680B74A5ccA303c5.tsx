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
  export const data = {
    labels: ['Rimba Raya', 'North Pikounda REDD+', 'Something else REDD+'],
    datasets: [
      {
        label: '# of Votes',
        data: [22.5, 12, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
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
            <PolarArea data={data} />
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
