
- you are a senior developer, your task it to create a chart based on statistics data
- you need to inteview me for all details you need to prepare a nice chart

- find the oldest betting tip date.
- this is the date where customer opened 3 account for Bet365, Tipsport and Nike with initial balance 1000 euro each
- create a nice chart for each betting company and overall based on historical betting tips



bash npm install recharts

Then create your component:
jsximport { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

Data
- column x - timeframe 
- column X - total balance
 


export default function AreaResponsiveContainer() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Area Responsive Container</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
Key components:

ResponsiveContainer - Makes the chart responsive to container size
AreaChart - Main chart wrapper
Area - The filled area (adjust fill color and fillOpacity to match your design)
CartesianGrid - The dotted grid lines
XAxis / YAxis - Axis labels
Tooltip - Hover information

To match the purple color in your image, change the fill color:
jsx<Area 
  type="monotone" 
  dataKey="value" 
  stroke="#9b8fd8" 
  fill="#9b8fd8" 
  fillOpacity={0.6}
/>
This will create a chart that looks exactly like your screenshot and works perfectly with your Next.js and MUI setup!



Backtest the graph logic
- starting balance for each account is set to 1000 euro 
- the cummulative balance must be calculated based on this example

Flow
- 01.11.2025 starting balance for bet365 is 1000 euro 
- 01.11.2025 customer places a bet for 400 and wins 416
   - Tenis, UTR Oxford ,Pires - Whitwell, 1, 1.04 ,bet365, 400, 416
   - cumulative balance is 1016
- 02.11 customer places a bet -  Volejbal, Aarhus - Amager, 1, 1.05, bet365, 600, 630
- cummulative balance is 1016 balance initial + (630 total win - 600 stake) = 1016 + 30 = 1046
- etc
   



