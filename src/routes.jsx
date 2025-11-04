import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import SamsDashboard from './pages/SamsDashboard';
import TSMESS from './pages/TSMESS';
import DpcRates from './pages/DpcRates';
import Vendors from './pages/Vendors';
import Menus from './pages/Menus';
import MenuFollowing from './pages/MenuFollowing';
import MenuOTFollowing from './pages/MenunOTFollowing';
import Tickets from './pages/Tickets';
import Indents from './pages/Indents';
import Items from './pages/Items';
import FoodItemIngredientMapping from './pages/FoodItemIngredientMapping';
import Reports from './pages/Reports';
import SchoolWiseVendorReleasing from './pages/SchoolWiseVendorReleasing';
import VendorWiseReleasing from './pages/VendorWiseReleasing';
import StaffRecords from './pages/StaffRecords';
import EditAttendanceEntries from './pages/EditAttendanceEntries';
import StockProvisions from './pages/StockProvisions';
import ComplaintEntry from './pages/ComplaintEntry';
import ComplaintDashboard from './pages/ComplaintDashboard';
import EditZoneContacts from './pages/EditZoneContacts';
import EditSchoolContacts from './pages/EditSchoolContacts';
import SchoolsDailyTracker from './pages/SchoolsDailyTracker';
import GrievanceForm from './pages/GrievanceForm';
import CsrDashboard from './pages/CsrDashboard';
import GrievanceDashboard from './pages/GrievanceDashboard';
import StaffEntryForm from './pages/StaffEntryForm';
import SickEntryDashboard from './pages/SickEntryDashboard';
import WrongEntriesAttendance from './pages/WrongEntriesAttendance';
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/grievanceform' element={<GrievanceForm/>} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/samsdashboard" element={
            <ProtectedRoute>
              <SamsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/tsmess" element={
            <ProtectedRoute>
              <TSMESS />
            </ProtectedRoute>
          } />
          <Route path="/dpcrates" element={
            <ProtectedRoute>
              <DpcRates />
            </ProtectedRoute>
          } />

           <Route path="/vendors" element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          } />

           <Route path="/menus" element={
            <ProtectedRoute>
              <Menus />
            </ProtectedRoute>
          } />

           <Route path="/menufollowing" element={
            <ProtectedRoute>
              <MenuFollowing />
            </ProtectedRoute>
          } />

          <Route path="/menuotfollowing" element={
            <ProtectedRoute>
              <MenuOTFollowing />
            </ProtectedRoute>
          } />
           
             <Route path='/tickets' element={
          <ProtectedRoute>
            <Tickets/>
          </ProtectedRoute>
        } />

         <Route path='/indents' element={
          <ProtectedRoute>
            <Indents/>
          </ProtectedRoute>
        } />

        
         <Route path='/items' element={
          <ProtectedRoute>
            <Items />
          </ProtectedRoute>
        } />

         <Route path='/itemingredientmapping' element={
          <ProtectedRoute>
            <FoodItemIngredientMapping/>
          </ProtectedRoute>
        } />

         <Route path='/reportsdashboard' element={
          <ProtectedRoute>
            <Reports/>
          </ProtectedRoute>
        } />

         <Route path='/schoolwisevendor' element={
          <ProtectedRoute>
            <SchoolWiseVendorReleasing/>
          </ProtectedRoute>
        } />

        <Route path='/vendorwisereleasing' element={
          <ProtectedRoute>
            <VendorWiseReleasing />
          </ProtectedRoute>
        } />

          <Route path='/staffrecords' element={
          <ProtectedRoute>
            <StaffRecords/>
          </ProtectedRoute>
        } />

         <Route path='/editattendanceentries' element={
          <ProtectedRoute>
            <EditAttendanceEntries/>
          </ProtectedRoute>
        } />

         <Route path='/stockprovisions' element={
          <ProtectedRoute>
            <StockProvisions />
          </ProtectedRoute>
        } />

         <Route path='/complaintentry' element={
          <ProtectedRoute>
            <ComplaintEntry />
          </ProtectedRoute>
        } />

        <Route path='/complaintdashboard' element={
          <ProtectedRoute>
            <ComplaintDashboard />
          </ProtectedRoute>
        } />

         <Route path='/zonescontact' element={
          <ProtectedRoute>
            <EditZoneContacts />
          </ProtectedRoute>
        } />


         <Route path='/schoolscontact' element={
          <ProtectedRoute>
            <EditSchoolContacts />
          </ProtectedRoute>
        } />

         <Route path='/schoolsdailytracker' element={
          <ProtectedRoute>
            <SchoolsDailyTracker/>
          </ProtectedRoute>
        } />

        <Route path='/csrdashboard' element={
          <ProtectedRoute>
            <CsrDashboard/>
          </ProtectedRoute>
        } />


        <Route path='/grievancedashboard' element={
          <ProtectedRoute>
            <GrievanceDashboard />
          </ProtectedRoute>
        } /> 

        <Route path='/staffentryform' element={
          <ProtectedRoute>
            <StaffEntryForm/>
          </ProtectedRoute>
        }
        
        />

        <Route path='/sickdashboard' element={
          <ProtectedRoute>
            <SickEntryDashboard />
          </ProtectedRoute>
        } />

        <Route path='/wrongentriesattendance' element={
          <ProtectedRoute>
            <WrongEntriesAttendance />
          </ProtectedRoute>
        } />

        </Route>

      
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
