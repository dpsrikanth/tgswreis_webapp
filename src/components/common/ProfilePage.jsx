import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Grid,
  Box,
  Chip,
  CircularProgress
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useSelector } from "react-redux";
import { _fetch } from "../../libs/utils";

const ProfilePage = () => {

  const token = useSelector((state) => state.userappdetails.TOKEN);
  const UserType = useSelector((state) => state.userappdetails.profileData.UserType);
  const UserId = useSelector((state) => state.userappdetails.profileData.Id);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const payload = {userId: UserId}
    const res = await _fetch(
      'userprofile',
      payload,
      false,
      token
    );

    if (res.status === "success") {
      setProfile(res.data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box display="flex" justifyContent="center" mt={4}>

      <Card
        sx={{
          width: 420,
          borderRadius: 3,
          boxShadow: 4
        }}
      >
        <CardContent>

          {/* ===== AVATAR ===== */}
          <Box textAlign="center" mb={2}>
            <Avatar
              sx={{
                width: 110,
                height: 110,
                bgcolor: stringToColor(profile.FullName),
                fontSize: 36,
                fontWeight: "bold",
                margin: "auto"
              }}
            >
              {getInitials(profile.FullName)}
            </Avatar>

            <Typography variant="h6" mt={1}>
              {profile.FullName}
            </Typography>

            {/* <Typography color="text.secondary">
              {profile.Designation}
            </Typography> */}

            <Chip
              label={profile.Designation}
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== DETAILS ===== */}
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <InfoRow
                icon={<PersonIcon />}
                label="Username"
                value={profile.UserName}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoRow
                icon={<EmailIcon />}
                label="Email"
                value={profile.Email || "-"}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoRow
                icon={<PhoneIcon />}
                label="Mobile"
                value={profile.Mobile || "-"}
              />
            </Grid>

            <Grid item xs={12}>
              <InfoRow
                icon={<LocationOnIcon />}
                label={
                  profile.RegionType === "None"
                    ? "Office"
                    : profile.RegionType
                }
                value={
                  profile.RegionName || "TGSWREIS Head Office"
                }
              />
            </Grid>

          </Grid>

        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;


const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
  >
    <Box sx={{ color: "primary.main" }}>
      {icon}
    </Box>

    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography fontWeight={600}>
        {value}
      </Typography>
    </Box>
  </Box>
);



const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();

const stringToColor = (string = "") => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += (`00${value.toString(16)}`).slice(-2);
  }

  return color;
};
