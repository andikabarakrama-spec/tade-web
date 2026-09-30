import { AdministrativeTask, HumanHandoffDetails, TaskRole } from './AdministrativeTaskOrchestrator';

export class HumanHandoffEngine {
  private static instance: HumanHandoffEngine;

  public static getInstance(): HumanHandoffEngine {
    if (!HumanHandoffEngine.instance) {
      HumanHandoffEngine.instance = new HumanHandoffEngine();
    }
    return HumanHandoffEngine.instance;
  }

  public createHandoff(
    task: AdministrativeTask,
    details: {
      completedSummary: string;
      pendingSummary: string;
      blockerReason: string;
      targetRole: TaskRole;
      actionRequired: string;
      preservedState?: Record<string, any>;
    }
  ): HumanHandoffDetails {
    const handoff: HumanHandoffDetails = {
      completedWorkSummary: details.completedSummary,
      pendingWorkSummary: details.pendingSummary,
      blockerReason: details.blockerReason,
      requiredAuthorityRole: details.targetRole,
      requiredAction: details.actionRequired,
      preservedStateData: details.preservedState || {},
      handoffTimestamp: new Date().toISOString()
    };

    task.state = 'BLOCKED';
    task.humanHandoff = handoff;

    return handoff;
  }

  public getPendingHandoffs(): Array<{ task: AdministrativeTask; handoff: HumanHandoffDetails }> {
    const tasks = (window as any)?.__tade_tasks || [];
    return tasks
      .filter((t: AdministrativeTask) => !!t.humanHandoff && t.state === 'BLOCKED')
      .map((t: AdministrativeTask) => ({ task: t, handoff: t.humanHandoff! }));
  }
}
