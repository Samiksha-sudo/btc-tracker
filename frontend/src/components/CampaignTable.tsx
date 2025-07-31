import React from 'react';
import { Play, Pause, BarChart3 } from 'lucide-react';
import { mockCampaigns } from '../utils/mockData';

export const CampaignTable: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-orange-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/20';
      case 'paused':
        return 'text-orange-500 bg-orange-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Campaign Management</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                ROI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockCampaigns.map((campaign) => {
              const roi = ((campaign.conversions * 100 - campaign.spent) / campaign.spent) * 100;
              const ctr = (campaign.clicks / campaign.impressions) * 100;
              const conversionRate = (campaign.conversions / campaign.clicks) * 100;
              
              return (
                <tr key={campaign.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{campaign.name}</div>
                      <div className="text-sm text-gray-400">{campaign.startDate} - {campaign.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(campaign.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-white">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      <div>CTR: {ctr.toFixed(2)}%</div>
                      <div>Conv: {conversionRate.toFixed(2)}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${roi > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};