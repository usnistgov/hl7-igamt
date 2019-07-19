package gov.nist.hit.hl7.igamt.bootstrap.util;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class ThreadForPHINVADSValueSetDigger extends Thread {
    private boolean done = false;
    private Timer timer;
    private TimerTask task;

    public ThreadForPHINVADSValueSetDigger(TimerTask task) {
	this.task = task;
    }

    public void quit() {
	this.done = true;
	this.interrupt();
    }

    public boolean finishing() {
	return (done || Thread.interrupted());
    }

    @Override
    public void run() {
	super.run();
	timer = new Timer();
	long period = 24 * 60 * 60 * 1000;
	timer.schedule(task, getNextRunTime(), period);
	while (!finishing()) {
	    try {
		Thread.sleep(10);
	    } catch (InterruptedException e) {
		break;
	    }
	}
	timer.cancel();
    }

    private Date getNextRunTime() {
	Calendar startTime = Calendar.getInstance();
	Calendar now = Calendar.getInstance();
	startTime.set(Calendar.HOUR_OF_DAY, 3);
	startTime.set(Calendar.MINUTE, 0);
	startTime.set(Calendar.SECOND, 0);
	startTime.set(Calendar.MILLISECOND, 0);

	System.out.println("####START##" + startTime.getTime());
	System.out.println("####NOW##" + now.getTime());

	if (startTime.before(now) || startTime.equals(now)) {
	    startTime.add(Calendar.DATE, 1);
	}
	System.out.println("#######" + startTime.getTime());
	return startTime.getTime();
    }
}
