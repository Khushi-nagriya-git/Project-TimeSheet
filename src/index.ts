import * as React from "react";
import { SPHttpClient } from "@microsoft/sp-http";
import { useState, useEffect, FormEvent,  createContext, useContext, ReactNode  } from "react";
import FormComponent from "./webparts/projectTimeSheet/CustomComponents/Projects/Forms/AddEditForm";
import {
  initialState,
  CustomFormData,
  ProjectManager,
} from "./webparts/projectTimeSheet/CustomComponents/Projects/Forms/IFormStats";
import {
  JobsData,
  jobsInitialState,
} from "./webparts/projectTimeSheet/CustomComponents/Jobs/IJobsStats";
import DeleteDialogBoxProps from "./webparts/projectTimeSheet/CustomComponents/Projects/DialogBoxs/DeleteDialogBox";
import { IProjectProps } from "./webparts/projectTimeSheet/CustomComponents/Projects/IProjectProps";
import {
  addProjects,
  getProjectListData,
  deleteProject,
  updateUserRecords,
} from "./webparts/projectTimeSheet/CustomComponents/Projects/Services";
import { getJobListData ,convertToMinutes} from "./webparts/projectTimeSheet/CustomComponents/Jobs/Services";
import {
  ProjectsData,
  projectsInitialState,
} from "./webparts/projectTimeSheet/CustomComponents/Projects/IProjectStats";
import Row from "./webparts/projectTimeSheet/CustomComponents/Projects/EmployeesView/TableRows";
import { styled } from "@mui/system";
import TopNavigation from "./webparts/projectTimeSheet/CustomComponents/Navigation/TopNavigation";
import {
  Button,
  Grid,
  Box,
  Avatar,
  Typography,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import ProjectHeader from "./webparts/projectTimeSheet/CustomComponents/Projects/EmployeesView/ProjectFilters";
import ProjectTable from "./webparts/projectTimeSheet/CustomComponents/Projects/EmployeesView/ProjectTable";
import Alert from "@mui/material/Alert";
import DepartmentView from "./webparts/projectTimeSheet/CustomComponents/Projects/DepartmentView/DepartmentView";
import MyTeam from "./webparts/projectTimeSheet/CustomComponents/Projects/MyTeam/myTeam";
import { Dropdown, IDropdownOption, Label, SearchBox } from "@fluentui/react";
import {
  Stack,
  TextField,
  Modal,
  DefaultButton,
  PrimaryButton,
} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IFormProps } from "./webparts/projectTimeSheet/CustomComponents/Projects/Forms/IFormProps";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer/Drawer";
import Table from "@mui/material/Table/Table";
import TableBody from "@mui/material/TableBody/TableBody";
import TableCell from "@mui/material/TableCell/TableCell";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel/TableSortLabel";
import ProjectStyle from "./webparts/projectTimeSheet/CustomComponents/Projects/Project.style";
import departmentView from "./webparts/projectTimeSheet/CustomComponents/Projects/DepartmentView/DepartmentView.module.scss";
import dialogBox from "./webparts/projectTimeSheet/CustomComponents/Projects/DialogBoxs/DialogBox.module.scss";

export {
  React,
  SPHttpClient,
  useState,
  Collapse,
  useEffect,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  FormComponent,
  initialState,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  DialogActions,
  TableHead,
  TableRow,
  dialogBox,
  TableSortLabel,
  Typography,Dialog,
  CustomFormData,
  FormEvent,
  convertToMinutes,
  Row,
  DialogContentText,
  JobsData,
  Stack,
  DefaultButton,
  PrimaryButton,
  DialogContent,
  PeoplePicker,
  IconButton,ProjectStyle,
  DialogTitle,
  Drawer,
  departmentView,
  IFormProps,
  PrincipalType,
  Modal,
  TextField,
  jobsInitialState,
  DeleteDialogBoxProps,
  IProjectProps,
  addProjects,
  getProjectListData,
  deleteProject,
  updateUserRecords,
  getJobListData,
  ProjectsData,
  projectsInitialState,
  styled,
  ProjectManager,
  TopNavigation,
  Button,
  Grid,
  CloseIcon,
  ProjectHeader,
  ProjectTable,
  Alert,
  DepartmentView,
  MyTeam,
  Dropdown,
  SearchBox,
  Label,
  IDropdownOption,
  Box,
  Avatar,
  createContext, useContext, ReactNode 
};
