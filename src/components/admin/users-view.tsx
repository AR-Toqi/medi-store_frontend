"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  UserX, 
  UserCheck, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Calendar,
  Mail,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminUsers, useAdminUserMutation } from "@/hooks/use-admin-users";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AdminUsersView() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useAdminUsers();
  const { updateStatus, deleteUser } = useAdminUserMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const nonAdminUsers = users?.filter((user: any) => user.role !== "ADMIN") || [];
  const filteredUsers = nonAdminUsers.filter((user: any) => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatus.mutate({ id, isBanned: !currentStatus });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteUser.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 gap-1.5"><ShieldCheck className="w-3 h-3" /> Admin</Badge>;
      case "SELLER":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 gap-1.5"><ShieldAlert className="w-3 h-3" /> Seller</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20 gap-1.5"><Shield className="w-3 h-3" /> Customer</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 border-l-4 border-[#00bc8c] pl-4">
            User <span className="text-[#00bc8c]">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Monitor activity, manage roles, and enforce platform policies.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          Total Users: <span className="text-[#00bc8c]">{nonAdminUsers.length}</span>
        </div>
      </div>

      {/* Stats Quick Look (Optional Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* We can add quick stats here if needed later */}
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00bc8c]/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0 overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">User Details</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Joined Date</TableHead>
                  <TableHead className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                         <Users className="h-12 w-12" />
                         <p className="font-bold">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: any) => (
                    <TableRow key={user.id} className="group border-slate-50 transition-colors hover:bg-slate-50/30">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-[#00bc8c]/10 border border-[#00bc8c]/10 flex items-center justify-center text-[#00bc8c] font-black text-lg overflow-hidden flex-shrink-0">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900 truncate">{user.name}</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {user.isBanned ? (
                           <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20 uppercase text-[10px] font-black px-2 py-0.5 rounded-lg">
                             Banned
                           </Badge>
                        ) : (
                           <Badge className="bg-[#00bc8c]/10 text-[#00bc8c] border-[#00bc8c]/20 uppercase text-[10px] font-black px-2 py-0.5 rounded-lg">
                             Active
                           </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-bold text-slate-500 text-sm">
                        <div className="flex items-center gap-2 uppercase tracking-tighter">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#00bc8c]/10 hover:text-[#00bc8c] cursor-pointer">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-slate-100 shadow-2xl">
                            <DropdownMenuItem 
                              className={`rounded-lg font-bold cursor-pointer gap-2 ${user.isBanned ? "text-[#00bc8c] focus:text-[#00bc8c] focus:bg-[#00bc8c]/10" : "text-amber-600 focus:text-amber-600 focus:bg-amber-50"}`}
                              onClick={() => handleToggleStatus(user.id, user.isBanned)}
                              disabled={updateStatus.isPending}
                            >
                              {user.isBanned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                              {user.isBanned ? "Unban Account" : "Ban Account"}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-slate-50" />
                            
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <div>
                                    <DropdownMenuItem 
                                      className="rounded-lg font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={!user.isBanned || deleteUser.isPending}
                                      onClick={() => setDeleteId(user.id)}
                                    >
                                      <Trash2 className="h-4 w-4" /> Delete Account
                                    </DropdownMenuItem>
                                  </div>
                                </TooltipTrigger>
                                {!user.isBanned && (
                                  <TooltipContent side="left" className="bg-slate-900 text-white border-none rounded-lg p-3 max-w-[200px]">
                                    <div className="flex gap-2 items-start">
                                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                      <p className="text-[10px] font-bold leading-tight">For security, active users cannot be deleted. Ban the account first.</p>
                                    </div>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 uppercase">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium py-2">
              This action is permanent and cannot be undone. All data associated with this user will be removed from our systems.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-slate-100 hover:bg-slate-50 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-xl font-bold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 cursor-pointer"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
