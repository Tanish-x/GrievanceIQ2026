const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/Dashboard/CitizenDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings for easier searching
content = content.replace(/\r\n/g, '\n');

// Replace top layout
const searchTop = `  return (
    <div className="bharat-container">`;

const replacementTop = `  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#F8FAFC', 
      pt: { xs: 2, md: 4 },
      pb: 8
    }}>
      <Container maxWidth="xl">
        {/* Modern SaaS Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 4,
            bgcolor: 'white',
            p: 3,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mr: 2,
                boxShadow: '0 4px 6px -1px rgba(49, 46, 129, 0.4)'
              }}>
                <DashboardIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
                  GrievanceIQ Platform
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                  Intelligent Civic Services • Connected as {formatAddress(account)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: { xs: 2, md: 0 }, display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoading && <CircularProgress size={24} sx={{ color: '#3B82F6' }} />}
              <Chip 
                label="Verified Identity" 
                size="small" 
                icon={<Verified sx={{ fontSize: 16 }} />}
                sx={{ 
                  bgcolor: '#ECFDF5', 
                  color: '#059669', 
                  fontWeight: 600, 
                  border: '1px solid #A7F3D0',
                  '& .MuiChip-icon': { color: '#059669' }
                }} 
              />
            </Box>
          </Box>
        </motion.div>

        {/* Modern Tabs */}
        <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider', bgcolor: 'white', borderRadius: 2, px: 2, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#3B82F6',
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 120,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#64748B',
                py: 2.5,
                '&:hover': {
                  color: '#1E293B',
                  backgroundColor: 'rgba(241, 245, 249, 0.5)'
                },
                '&.Mui-selected': {
                  color: '#1E293B',
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label.split(' • ')[1] || tab.label}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <AnimatePresence mode="wait">`;

const searchEnd = `      </AnimatePresence>
    </div>
  );
};`;

const replacementEnd = `      </AnimatePresence>
      </Container>
    </Box>
  );
};`;

const topStartIdx = content.indexOf(searchTop);
if (topStartIdx === -1) {
  console.error("Could not find top wrapper");
  process.exit(1);
}

const targetEndStr = `        {/* Dashboard Tab */}`;
const topEndIdx = content.indexOf(targetEndStr, topStartIdx);

if (topEndIdx === -1) {
    console.error("Could not find Dashboard tab comment");
    process.exit(1);
}

let newContent = content.substring(0, topStartIdx) + replacementTop + '\n' + content.substring(topEndIdx);

const bottomStartIdx = newContent.lastIndexOf(searchEnd);
if (bottomStartIdx === -1) {
    console.error("Could not find bottom wrapper");
    process.exit(1);
}

newContent = newContent.substring(0, bottomStartIdx) + replacementEnd + newContent.substring(bottomStartIdx + searchEnd.length);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated CitizenDashboard layout');
