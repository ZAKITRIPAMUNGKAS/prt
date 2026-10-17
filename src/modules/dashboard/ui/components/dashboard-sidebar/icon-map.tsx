import {
  IconLayoutDashboard,
  IconPhoto,
  IconUser,
  IconBuildingPavilion,
  IconNotebook,
  IconBriefcase,
  IconFileCv,
  IconMusic,
} from "@tabler/icons-react";

interface IconMapProps {
  icon: string;
}

const IconMap = ({ icon }: IconMapProps) => {
  switch (icon) {
    case "dashboard":
      return <IconLayoutDashboard />;
    case "photo":
      return <IconPhoto />;
    case "user":
      return <IconUser />;
    case "city":
      return <IconBuildingPavilion />;
    case "post":
      return <IconNotebook />;
    case "project":
      return <IconBriefcase />;
    case "application":
      return <IconFileCv />;
    case "music":
    case "playlist":
      return <IconMusic />;
    default:
      return <IconLayoutDashboard />;
  }
};

export default IconMap;
