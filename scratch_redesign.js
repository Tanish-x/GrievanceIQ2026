const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/Dashboard/CitizenDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('<TabPanel key="dashboard" value={currentTab} index={0}>');
const endIndex = content.indexOf('{/* Profile Tab with Indian Heritage Theme */}');

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end markers");
  process.exit(1);
}

const replacement = `<TabPanel key="dashboard" value={currentTab} index={0}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 1, md: 2 } }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                डैशबोर्ड • Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#64748B', fontWeight: 500 }}>
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः • May All Be Happy and Healthy
              </Typography>
            </Box>

            {/* Statistics Grid - Compact SaaS Style */}
            <Grid container spacing={2.5} sx={{ mb: 5 }}>
              {[
                { title: 'कुल दस्तावेज़', subtitle: 'Total Documents', value: stats.totalDocuments, icon: <DocumentIcon />, color: '#3B82F6' },
                { title: 'सत्यापित दस्तावेज़', subtitle: 'Verified Documents', value: stats.verifiedDocuments, icon: <Verified />, color: '#10B981' },
                { title: 'लंबित शिकायतें', subtitle: 'Pending Grievances', value: stats.pendingGrievances, icon: <PendingIcon />, color: '#F59E0B' },
                { title: 'हल की गई समस्याएं', subtitle: 'Resolved Issues', value: stats.resolvedGrievances, icon: <CheckCircle />, color: '#6366F1' },
                { title: 'सरकारी सेवाएं', subtitle: 'Government Services', value: stats.governmentServices || 12, icon: <AccountBalance />, color: '#EC4899' },
                { title: 'मोबाइल सुविधाएं', subtitle: 'Mobile Features', value: stats.mobileFeatures || 4, icon: <SmartToyIcon />, color: '#8B5CF6' },
                { title: 'भुगतान इतिहास', subtitle: 'Payment History', value: stats.completedPayments || 0, icon: <AccountBalance />, color: '#14B8A6' },
                { title: 'आपातकालीन सेवाएं', subtitle: 'Emergency Services', value: stats.emergencyContacts || 3, icon: <Security />, color: '#EF4444' }
              ].map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ 
                    p: 2.5, 
                    borderRadius: 3, 
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    border: '1px solid #F1F5F9',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderColor: '#E2E8F0' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: \`\${stat.color}15\`, color: stat.color, display: 'flex' }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B' }}>{stat.value}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>{stat.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>{stat.subtitle}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* AI Capabilities Section */}
            <Box sx={{ mb: 5, p: 4, borderRadius: 4, background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -20, opacity: 0.05, transform: 'scale(1.5)' }}>
                <BrainIcon sx={{ fontSize: 250 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                <MagicIcon sx={{ mr: 1.5 }} /> AI विश्लेषण • Intelligence Hub
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: '#C7D2FE', position: 'relative', zIndex: 1, opacity: 0.9 }}>
                उन्नत दस्तावेज़ प्रसंस्करण और स्मार्ट शिकायत समाधान • Advanced Document Processing & Smart Grievance Resolution
              </Typography>
              <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                {[
                  { title: 'AI दस्तावेज़ विश्लेषण', subtitle: 'AI Document Analysis', icon: <AnalyticsIcon />, action: () => setCurrentTab(4) },
                  { title: 'स्मार्ट शिकायत दर्ज करें', subtitle: 'Smart Grievance Submission', icon: <GrievanceIcon />, action: () => setCurrentTab(3) }
                ].map((action, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Card sx={{ 
                      p: 2.5, 
                      bgcolor: 'rgba(255,255,255,0.06)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)', borderColor: 'rgba(255,255,255,0.2)' }
                    }} onClick={action.action}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ p: 1.5, mr: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                          {action.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{action.title}</Typography>
                          <Typography variant="caption" sx={{ color: '#E0E7FF' }}>{action.subtitle}</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Quick Actions Grid */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 3 }}>
              त्वरित कार्य • Quick Actions
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 5 }}>
              {[
                { title: 'दस्तावेज़ अपलोड', subtitle: 'Upload Document', icon: '📤', action: () => setCurrentTab(2) },
                { title: 'प्रोफ़ाइल अपडेट', subtitle: 'Update Profile', icon: '👤', action: () => setCurrentTab(1) },
                { title: 'सरकारी सेवाएं', subtitle: 'Government Services', icon: '🏛️', action: () => setCurrentTab(5) },
                { title: 'QR और मोबाइल', subtitle: 'QR & Mobile', icon: '📱', action: () => setCurrentTab(6) },
                { title: 'भुगतान सेवाएं', subtitle: 'Payment Services', icon: '💳', action: () => setCurrentTab(7) },
                { title: 'आपातकालीन सेवाएं', subtitle: 'Emergency Services', icon: '🚨', action: () => setCurrentTab(8) }
              ].map((action, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{ 
                    p: 2.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }} onClick={action.action}>
                    <Box sx={{ fontSize: '1.8rem', mr: 2, bgcolor: '#F8FAFC', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                      {action.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>{action.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>{action.subtitle}</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* System Status Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                सिस्टम स्थिति • System Status
              </Typography>
              <Tooltip title="स्थिति रीफ्रेश करें • Refresh Status">
                <IconButton size="small" sx={{ color: '#64748B', bgcolor: '#F1F5F9', '&:hover': { bgcolor: '#E2E8F0' } }}>
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', overflow: 'hidden' }}>
              <Grid container>
                {[
                  { name: 'ब्लॉकचेन नेटवर्क', englishName: 'Blockchain Network', status: 'Connected', statusHindi: 'जुड़ा हुआ', color: '#10B981' },
                  { name: 'IPFS भंडारण', englishName: 'IPFS Storage', status: 'Online', statusHindi: 'ऑनलाइन', color: '#10B981' },
                  { name: 'AI प्रसंस्करण', englishName: 'AI Processing', status: 'Available', statusHindi: 'उपलब्ध', color: '#10B981' },
                  { name: 'दस्तावेज़ सत्यापन', englishName: 'Document Verification', status: 'Active', statusHindi: 'सक्रिय', color: '#10B981' },
                  { name: 'सरकारी APIs', englishName: 'Government APIs', status: 'Connected', statusHindi: 'जुड़ा हुआ', color: '#10B981' },
                  { name: 'मोबाइल सेवाएं', englishName: 'Mobile Services', status: 'Active', statusHindi: 'सक्रिय', color: '#10B981' },
                  { name: 'भुगतान गेटवे', englishName: 'Payment Gateway', status: 'Secure', statusHindi: 'सुरक्षित', color: '#10B981' },
                  { name: 'आपातकालीन सिस्टम', englishName: 'Emergency System', status: 'Ready', statusHindi: 'तैयार', color: '#10B981' }
                ].map((service, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index} sx={{ 
                    p: 2.5, 
                    borderBottom: '1px solid #F1F5F9',
                    borderRight: { md: (index + 1) % 4 !== 0 ? '1px solid #F1F5F9' : 'none', sm: (index + 1) % 2 !== 0 ? '1px solid #F1F5F9' : 'none' },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: service.color, mr: 1.5, boxShadow: \`0 0 8px \${service.color}60\` }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {service.name}
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 2.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                        {service.englishName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: service.color, fontWeight: 600, bgcolor: \`\${service.color}15\`, px: 1, py: 0.25, borderRadius: 1 }}>
                        {service.statusHindi} • {service.status}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Footer */}
            <Box sx={{ mt: 6, textAlign: 'center', pt: 4, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', mb: 0.5 }}>
                वसुधैव कुटुम्बकम् • The World is One Family
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Powered by GrievanceIQ - Connecting India's Digital Future with Blockchain Technology
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        `;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated Dashboard tab UI');
