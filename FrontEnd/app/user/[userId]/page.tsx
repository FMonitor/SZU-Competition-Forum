"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Tooltip,
  Tab,
  Tabs,
  Spinner,
} from "@heroui/react";
import {
  Edit3,
  Check,
  X,
  Mail,
  GraduationCap,
  BookOpenIcon,
  CameraIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { TeamCard, Team, TeamMember } from "@/components/Card/TeamCard";
import { ArticleCard } from "@/components/Card/ArticleCard";
import { API_BASE_URL } from "@/CONFIG";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  grade: string;
  major: string;
  role: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  cover_image: string;
  view_count: number;
  created_at: string;
}

const UserProfileSidebar: React.FC<{
  user: User;
  onEdit: () => void;
  isEditing: boolean;
  onSave: (updatedUser: User) => void;
}> = ({ user, onEdit, isEditing, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${API_BASE_URL}/upload_image`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.errno === 0) {
          setEditedUser({ ...editedUser, avatar_url: data.data.url });
          toast.success("头像上传成功！");
        } else {
          toast.error("上传图片失败！");
        }
      } catch (error) {
        console.error("图片上传失败:", error);
        toast.error("上传图片出错！");
      }
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm mx-auto overflow-hidden">
        <CardBody className="p-6">
          <div className="flex flex-col items-center">
            <div
              className={`relative ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={handleAvatarClick}
              title={isEditing ? "点击上传头像" : ""}
            >
              <Avatar
                src={avatarPreview}
                className="w-32 h-32 text-large mb-4"
              />
              {isEditing && (
                <Tooltip content="点击更改头像">
                  <div className="absolute bottom-2 right-2 bg-gray-700 rounded-full p-1">
                    <CameraIcon size={20} color="white" />
                  </div>
                </Tooltip>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {isEditing ? (
              <Input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="text-2xl font-bold text-center mb-2 w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold text-center mb-2">
                {editedUser.name}
              </h2>
            )}
            <p className="text-default-500 text-center mb-4">
              {editedUser.role}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail size={18} />
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span className="truncate">{editedUser.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="年级" placement="bottom">
                <GraduationCap size={18} />
              </Tooltip>
              {isEditing ? (
                <Input
                  type="text"
                  name="grade"
                  value={editedUser.grade}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{editedUser.grade}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="专业" placement="bottom">
                <BookOpenIcon size={18} />
              </Tooltip>
              {isEditing ? (
                <Input
                  type="text"
                  name="major"
                  value={editedUser.major}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
              ) : (
                <span>{editedUser.major}</span>
              )}
            </div>
          </div>

          {userId === localStorage.getItem("id") && (
            <div className="mt-6">
              <Button
                color={isEditing ? "success" : "primary"}
                variant="shadow"
                startContent={
                  isEditing ? <Check size={18} /> : <Edit3 size={18} />
                }
                className="w-full"
                onPress={isEditing ? handleSave : onEdit}
              >
                {isEditing ? "保存信息" : "修改信息"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingTeamsArticles, setIsLoadingTeamsArticles] = useState(true);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/info/${userId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("保存失败！");
      }
      const data = await response.json();
      setUser(data);
      toast.success("信息保存成功！");
      setIsEditing(false);
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败！");
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoadingTeamsArticles(true);
    try {
      const [teamsResponse, articlesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/user/teams/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }),
        fetch(`${API_BASE_URL}/api/user/articles/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }),
      ]);

      if (!teamsResponse.ok || !articlesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const teamsData = await teamsResponse.json();
      const articlesData = await articlesResponse.json();

      const formattedTeams: Team[] = teamsData.map((item: any) => ({
        ...item.team,
        requirements: item.team.requirements.flatMap((req: string) =>
          req.split("\n")
        ),
        members: item.members,
      }));

      setTeams(formattedTeams);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("加载数据失败，请稍后重试！");
    } finally {
      setIsLoadingTeamsArticles(false);
    }
  }, [userId]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/info/${userId}`
      );
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError("用户不存在");
      toast.error("页面找不到，3 秒后自动返回主页...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchUser();
    fetchData();
  }, [fetchUser, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-lg">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <X size={100} color="red" />
        <h1 className="text-2xl font-bold mt-4">{error}</h1>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockTeamActions = {
    onJoinTeam: async () => {
      toast.error("你没办法在此页面进行该操作！");
    },
    onLeaveTeam: async () => {
      toast.error("你没办法在此页面进行该操作！");
    },
    onUpdateTeam: async () => {
      toast.error("你没办法在此页面进行该操作！");
    },
    onDisbandTeam: async () => {
      toast.error("你没办法在此页面进行该操作！");
    },
    onRemoveMember: async () => {
      toast.error("你没办法在此页面进行该操作！");
    },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <UserProfileSidebar
              user={user}
              onEdit={handleEdit}
              isEditing={isEditing}
              onSave={handleSave}
            />
          </div>
          <div className="flex-1">
            <Card className="w-full">
              <CardBody>
                <Tabs aria-label="Profile sections" fullWidth>
                  <Tab key="teams" title="我的队伍">
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {isLoadingTeamsArticles ? (
                          <Spinner />
                        ) : teams.length > 0 ? (
                          teams.map((team) => (
                            <TeamCard
                              key={team.id}
                              team={team}
                              members={team.members}
                              {...mockTeamActions}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64">
                            <X className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-center text-gray-500">
                              该用户没有加入任何队伍！
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab key="articles" title="我的文章">
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {isLoadingTeamsArticles ? (
                          <Spinner />
                        ) : articles.length > 0 ? (
                          articles.map((article) => (
                            <ArticleCard
                              key={article.id}
                              {...article}
                              isAuthor={true}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64">
                            <X className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-center text-gray-500">
                              该用户没有发布任何文章！
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
