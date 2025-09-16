import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Feedback as FeedbackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useTheme } from '../../../hooks/useTheme';

export default function DashboardPage() {
  const { mode } = useTheme();

  // Static data for demo
  const stats = {
    totalUsers: 1247,
    adminUsers: 8,
    feedbackCount: 342,
    growth: {
      users: 12.5,
      feedback: 8.3,
      admins: 0
    }
  };

  const StatCard = ({ title, value, icon, color, growth }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    growth?: number;
  }) => (
    <Card
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}20`,
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: mode === 'light' ? '#333' : '#fff',
                mb: 0.5,
              }}
            >
              {value.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: mode === 'light' ? '#666' : '#aaa',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        
        {growth !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Chip
              icon={growth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${growth >= 0 ? '+' : ''}${growth}%`}
              size="small"
              sx={{
                bgcolor: growth >= 0 ? '#4caf5015' : '#f4433615',
                color: growth >= 0 ? '#4caf50' : '#f44336',
                border: `1px solid ${growth >= 0 ? '#4caf5030' : '#f4433630'}`,
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                color: mode === 'light' ? '#666' : '#aaa',
              }}
            >
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const ActivityChart = () => (
    <Card
      sx={{
        p: 3,
        bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
        border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: mode === 'light' ? '#333' : '#fff',
            fontWeight: 600,
          }}
        >
          User Activity Overview
        </Typography>
        
        {/* Simple bar chart representation */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              New Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              156 this month
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: mode === 'light' ? '#f0f0f0' : '#333',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              423 active
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={60}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: mode === 'light' ? '#f0f0f0' : '#333',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              API Usage
            </Typography>
            <Typography variant="body2" color="text.secondary">
              89% capacity
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={89}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: mode === 'light' ? '#f0f0f0' : '#333',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)',
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          color: mode === 'light' ? '#333' : '#fff',
          fontWeight: 600,
        }}
      >
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PeopleIcon />}
          color="#667eea"
          growth={stats.growth.users}
        />
        <StatCard
          title="Admin Users"
          value={stats.adminUsers}
          icon={<AdminIcon />}
          color="#f093fb"
          growth={stats.growth.admins}
        />
        <StatCard
          title="User Feedback"
          value={stats.feedbackCount}
          icon={<FeedbackIcon />}
          color="#4caf50"
          growth={stats.growth.feedback}
        />
      </Box>

      {/* Activity Chart */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <ActivityChart />
        <Card
          sx={{
            p: 3,
            bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: mode === 'light' ? '#333' : '#fff',
                fontWeight: 600,
              }}
            >
              Quick Stats
            </Typography>
            
            <Box sx={{ space: 'y-3' }}>
              <Box sx={{ p: 2, bgcolor: mode === 'light' ? '#f8f9fa' : '#252525', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Session Duration
                </Typography>
                <Typography variant="h6" sx={{ color: mode === 'light' ? '#333' : '#fff' }}>
                  14m 32s
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: mode === 'light' ? '#f8f9fa' : '#252525', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most Active Hour
                </Typography>
                <Typography variant="h6" sx={{ color: mode === 'light' ? '#333' : '#fff' }}>
                  2:00 PM - 3:00 PM
                </Typography>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: mode === 'light' ? '#f8f9fa' : '#252525', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Server Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      mr: 1,
                    }}
                  />
                  <Typography variant="h6" sx={{ color: '#4caf50' }}>
                    Online
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}