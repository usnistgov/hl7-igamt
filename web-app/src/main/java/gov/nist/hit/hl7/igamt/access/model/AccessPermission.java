package gov.nist.hit.hl7.igamt.access.model;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class AccessPermission {
	public static class AccessPermissionHolder {
		private final Set<Action> actions = new HashSet<>();
		public void allowAction(Action action) {
			actions.add(action);
		}
		public void allow(AccessPermission permission) {
			actions.addAll(permission.getActions());
		}
		public void allowActions(Action... action) {
			actions.addAll(Arrays.asList(action));
		}
		public void allowAll() {
			allowActions(Action.values());
		}
		public void denyAll() {
			denyActions(Action.values());
		}
		public void denyAction(Action action) {
			actions.remove(action);
		}
		public void denyActions(Action... action) {
			Arrays.asList(action).forEach(actions::remove);
		}
		public void allowActions(Set<Action> actions) {
			actions.addAll(actions);
		}
		public boolean actionIsAllowed(Action action) {
			return actions.contains(action);
		}
		public AccessPermission getPermission() {
			return new AccessPermission(this);
		}
	}

	public static AccessPermission withActions(Action... actions) {
		AccessPermissionHolder holder = new AccessPermissionHolder();
		holder.actions.addAll(Arrays.asList(actions));
		return holder.getPermission();
	}

	public static AccessPermission all() {
		AccessPermissionHolder holder = new AccessPermissionHolder();
		holder.allowAll();
		return holder.getPermission();
	}

	public static AccessPermission withNoAction() {
		AccessPermissionHolder holder = new AccessPermissionHolder();
		return holder.getPermission();
	}


	private final AccessPermissionHolder accessPermissionHolder;

	public AccessPermission(AccessPermissionHolder accessPermissionHolder) {
		this.accessPermissionHolder = accessPermissionHolder;
	}

	public boolean actionIsAllowed(Action action) {
		return accessPermissionHolder.actionIsAllowed(action);
	}

	public boolean noActionIsAllowed() {
		return accessPermissionHolder.actions.isEmpty();
	}

	public Set<Action> getActions() {
		return new HashSet<>(accessPermissionHolder.actions);
	}
}
