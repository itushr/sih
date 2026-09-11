import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Citizen from "../citizen";
import Administration from "../administration";
import ApiRegistration from "../administration/pages/apis/ApiRegistration";
import WorkflowCanvas from "../administration/pages/workflow/WorkflowCanvas";
import WorkflowListPage from "../administration/pages/workflow/WorkflowListPage";

export default function AppRoutes() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Citizen />} />
    <Route path="/administration" element={<Administration />} />
    <Route path="/administration/api-registry" element={<Administration page="registry" />} />
    <Route path="/administration/api-registry/new" element={<Administration page="register" />} />
    <Route path="/administration/api-registry/:endpointId/edit" element={<Administration page="registry-edit" />} />
    <Route path="/administration/api-registry/:endpointId" element={<Administration page="registry-detail" />} />
    <Route path="/administration/access-policies" element={<Administration page="policies" />} />
    <Route path="/administration/access-policies/new" element={<Administration page="policy-create" />} />
    <Route path="/administration/errors-logs" element={<Administration page="logs" />} />
    <Route path="/administration/errors-logs/:logId" element={<Administration page="log-detail" />} />
    <Route path="/administration/event-registry" element={<Administration page="events" />} />
    <Route path="/administration/event-registry/new" element={<Administration page="event-create" />} />
    <Route path="/administration/event-registry/:eventId/edit" element={<Administration page="event-edit" />} />
    <Route path="/administration/event-registry/:eventId" element={<Administration page="event-detail" />} />
    <Route path="/administration/subscriptions" element={<Administration page="subscriptions" />} />
    <Route path="/administration/subscriptions/new" element={<Administration page="subscription-create" />} />
    <Route path="/administration/subscriptions/:subscriptionId" element={<Administration page="subscription-detail" />} />
    <Route path="/administration/orchestrations" element={<Administration page="orchestrations" />} />
    <Route path="/administration/orchestrations/new" element={<Administration page="orchestration-create" />} />
    <Route path="/administration/apis/register" element={<ApiRegistration />} />
    <Route path="/administration/workflows" element={<WorkflowListPage />} />
    <Route path="/administration/workflows/new" element={<WorkflowCanvas />} />
    <Route path="/administration/workflows/:workflowId" element={<WorkflowCanvas />} />
    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
  </Routes></BrowserRouter>;
}
